import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongoose.js';
import Resource from '../../../../models/Resource.js';
import { rateLimitMiddleware } from '../../../_middleware/rateLimit.js';

async function DELETEREQ(request, { params }) {
  await dbConnect();

  const { id } = params;
  const token = request.headers.get("authorization")?.replace("Bearer-", "");
 console.log(token , process.env.SECRET);
  if (token !== process.env.SECRET) {
    return NextResponse.json({ boo: "hoo", jokes: "on you!" }, { status: 400 });
  }

  try {
    const document = await Resource.findByIdAndDelete(id);
    if (!document) {
      return NextResponse.json({ error: "Resource not found" }, { status: 404 });
    }
    return NextResponse.json({ msg: "deleted successfully", data: document }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ error: e.message }, { status: 403 });
  }
}

export const DELETE = rateLimitMiddleware(DELETEREQ);