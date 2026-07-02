import equipmentData from "@/mock/equipment.json";
import ownersData from "@/mock/owners.json";
import { notFound } from "next/navigation";
import { EquipmentDetailsClient } from "./EquipmentDetailsClient";

export default async function EquipmentDetailsPage({ params }) {
  const { id } = await params;
  
  const equipment = equipmentData.find(eq => eq.id === id);
  if (!equipment) {
    notFound();
  }

  const owner = ownersData.find(o => o.id === equipment.ownerId);

  return <EquipmentDetailsClient equipment={equipment} owner={owner} />;
}
