import { Card, CardHeader } from "@/components/ui/card";
import React from "react";
import { LoginFlow } from "./types";

interface DaftarCardProps {
  setState: (state: LoginFlow) => void;
}

const DaftarCard = ({ setState }: DaftarCardProps) => {
  return (
    <Card>
      <CardHeader>Daftar</CardHeader>
    </Card>
  );
};

export default DaftarCard;
