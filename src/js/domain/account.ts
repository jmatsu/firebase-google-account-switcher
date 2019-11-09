import { Email, ProjectId } from "./valueobject";

export type AccountId = Email;

export interface Account {
  id: AccountId;
  email: Email;
  associatedProjectIds: ProjectId[];
}
