"use server";
import { DocType } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/db";
function text(f: FormData, k: string) { const v = f.get(k); return typeof v === "string" ? v.trim() : ""; }
async function current() { const u = await getCurrentUser(); if (!u) redirect("/login"); return u; }
export async function updateProfile(f: FormData) { const u = await current(), name = text(f,"name"), phone = text(f,"phone"), address = text(f,"address"); if(name.length<2 || (phone && phone.length<8)) redirect("/profile?error=invalid-profile#profile"); if(phone && await prisma.user.findFirst({where:{phone,id:{not:u.id}},select:{id:true}})) redirect("/profile?error=phone-in-use#profile"); await prisma.user.update({where:{id:u.id},data:{name,phone:phone||null,address:address||null}}); revalidatePath("/profile"); redirect("/profile?updated=profile#profile"); }
export async function uploadIdentityDoc(f: FormData) { const u=await current(), type=text(f,"type"), file=f.get("file"); if((type!==DocType.KTP&&type!==DocType.SIM)||!(file instanceof File)||!file.size||file.size>500000||!["image/jpeg","image/png","application/pdf"].includes(file.type)) redirect("/profile?error=invalid-document#documents"); const url=`data:${file.type};base64,${Buffer.from(await file.arrayBuffer()).toString("base64")}`; await prisma.identityDoc.upsert({where:{userId_type:{userId:u.id,type}},create:{userId:u.id,type,fileUrl:url},update:{fileUrl:url,status:"PENDING",reviewedBy:null,reviewedAt:null}}); revalidatePath("/profile"); redirect("/profile?updated=document#documents"); }