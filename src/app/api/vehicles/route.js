import { NextResponse } from "next/server";
import Vehicle from "../(models)/Vehicle";

export async function GET() {
  try {
    const vehicles = await Vehicle.find();
   
    return NextResponse.json({
      message: "Araçlar Bulundu",
      data: vehicles,
      
      
    });
  } catch (err) {
    return NextResponse.json(
      {
        message: "Araç verileri alınırken bir hata oluştu",
      },
      { status: 500 }
    );
  }
}
