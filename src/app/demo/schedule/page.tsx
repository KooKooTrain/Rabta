import type { Metadata } from "next";
import { SchedulePage } from "@/components/demo/SchedulePage";

export const metadata: Metadata = { title: "Schedule" };
export default function ScheduleRoute() { return <SchedulePage />; }
