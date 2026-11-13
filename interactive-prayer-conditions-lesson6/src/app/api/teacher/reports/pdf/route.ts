import { NextRequest, NextResponse } from "next/server";
import { teacherSessionFromRequest } from "@/lib/auth";
import { buildAssessmentReport, buildClassReport, buildStudentReport } from "@/lib/pdf-reports";
import { logAudit } from "@/lib/student";
export const dynamic="force-dynamic";
export const maxDuration=30;
export async function GET(req:NextRequest){
  const teacher=await teacherSessionFromRequest(req);if(!teacher)return NextResponse.json({error:"غير مصرح"},{status:401});
  const url=new URL(req.url);const studentId=Number(url.searchParams.get("studentId")||0);const classroomId=Number(url.searchParams.get("classroomId")||0);const type=url.searchParams.get("type");const attemptId=Number(url.searchParams.get("attemptId")||0);
  if((studentId&&!Number.isInteger(studentId))||(classroomId&&!Number.isInteger(classroomId))||(attemptId&&!Number.isInteger(attemptId)))return NextResponse.json({error:"معرف غير صالح"},{status:400});
  if(type==="assessment"&&!studentId)return NextResponse.json({error:"حدد الطالب لتقرير الاختبار الختامي"},{status:400});
  try{const buffer=type==="assessment"?await buildAssessmentReport(teacher.teacherId,studentId,attemptId||undefined):studentId?await buildStudentReport(teacher.teacherId,studentId):await buildClassReport(teacher.teacherId,classroomId||undefined);
    const filename=type==="assessment"?`assessment-${studentId}-report.pdf`:studentId?`student-${studentId}-report.pdf`:`class-${classroomId||"all"}-report.pdf`;
    await logAudit("teacher",teacher.teacherId,"pdf_report_downloaded","reports",studentId||classroomId||null);
    return new NextResponse(new Uint8Array(buffer),{headers:{"Content-Type":"application/pdf","Content-Disposition":`attachment; filename="${filename}"`,"Cache-Control":"private, no-store","X-Content-Type-Options":"nosniff"}});
  }catch(e){const message=e instanceof Error?e.message:"";if(/غير موجود/.test(message))return NextResponse.json({error:message},{status:404});console.error("PDF report error",e);return NextResponse.json({error:"تعذر إنشاء تقرير PDF؛ حاول مرة أخرى"},{status:500});}
}
