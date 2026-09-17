"use client";

import { useParams } from "next/navigation";
import SupportTicketDetail from "@/features/support-tickets/components/support-ticket-detail";

export default function SupportTicketPage() {
  const params = useParams();
  const ticketId = params.ticketId as string;

  return <SupportTicketDetail ticketId={ticketId} />;
}
