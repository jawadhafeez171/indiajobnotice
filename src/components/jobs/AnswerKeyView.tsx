import React from "react";
import { JobNotification } from "@/data/jobs";
import { StageView } from "./StageView";

interface Props {
  job: JobNotification;
  stateSlug?: string;
}

export function AnswerKeyView({ job, stateSlug }: Props) {
  return <StageView job={job} kind="answer_key" stateSlug={stateSlug} />;
}
