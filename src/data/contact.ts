export const topics = ["question", "project", "other"] as const;
export type Topic = (typeof topics)[number];

// Libellés utilisés dans l'objet de l'email reçu
export const topicSubjects: Record<Topic, string> = {
  question: "Échange / question",
  project: "Projet perso ou idée",
  other: "Autre",
};

export const limits = { name: 100, email: 200, message: 5000, messageMin: 10 };

export type ContactField = "name" | "email" | "topic" | "message";

export type ContactState = {
  status: "idle" | "success" | "error";
  error?: "invalid" | "captcha" | "send";
  fields?: ContactField[];
  // Renvoyées en cas d'erreur, car React vide le formulaire après chaque envoi
  values?: Record<ContactField, string>;
};
