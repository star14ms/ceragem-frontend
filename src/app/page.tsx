"use client";
import { useSelector } from "react-redux";
import { selectActiveBotId } from "@/store/slices/botSlice";
import { redirect } from 'next/navigation';

export default function Index() {
  const chatbot_id = useSelector(selectActiveBotId);

  return redirect(`/chat/${chatbot_id}`);
};
