import QueueCounter from "../models/QueueCounter.js";

export function normalizeQueueDate(value = new Date()) {
  const queueDate = new Date(value);

  if (Number.isNaN(queueDate.getTime())) {
    throw new Error("Invalid queue date.");
  }

  queueDate.setUTCHours(0, 0, 0, 0);
  return queueDate;
}

export async function getNextTokenNumber(doctorId, queueDate) {
  const normalizedQueueDate = normalizeQueueDate(queueDate);
  const counterId = `${doctorId}:${normalizedQueueDate
    .toISOString()
    .slice(0, 10)}`;

  const counter = await QueueCounter.findOneAndUpdate(
    { _id: counterId },
    {
      $setOnInsert: {
        doctor: doctorId,
        queueDate: normalizedQueueDate,
      },
      $inc: { lastTokenNumber: 1 },
    },
    {
      returnDocument: "after",
      upsert: true,
      setDefaultsOnInsert: false,
    }
  );

  return counter.lastTokenNumber;
}
