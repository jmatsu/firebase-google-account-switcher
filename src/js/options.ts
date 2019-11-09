import * as $ from "jquery";
import AccountRepository from "./repository/account_repository";
import { Email } from "./domain/valueobject";
import {
  CreateAccountUsecase,
  CreateAccountUsecaseArgs
} from "./usecase/create_account_usecase";
import { Account } from "./domain/account";
import { DeleteAccountUsecase } from "./usecase/delete_account_usecase";

const accountRepository = new AccountRepository();

const appendAccount = (container, account: Account) => {
  const item = $("<li></li>");
  item.attr("id", account.id);

  const div = $("<div></div>");
  div.append(account.email);

  const deleteButton = $('<a name="delete"> Delete</button>');
  deleteButton.click(async () => {
    const usecase = new DeleteAccountUsecase();
    await usecase.apply({ id: account.id });
    renderAccounts();
  });
  div.append(deleteButton);

  item.append(div);
  container.append(item);
};

const renderAccounts = () => {
  const container = $("#accountsContainer");

  container.children().remove();

  accountRepository.findAll().then(accounts => {
    accounts.forEach(account => appendAccount(container, account));
  });
};

$(() => {
  renderAccounts();

  // TODO auto switch feature

  $("#addNewAccount").click(async () => {
    const emailInput = $("input#newAccountEmail");

    if (!(emailInput[0] as any).checkValidity()) {
      return;
    }

    const givenEmail = emailInput.val();

    const button = $(this).attr("disabled", `${true}`);

    const email: Email = givenEmail.toString();
    const args: CreateAccountUsecaseArgs = { email };
    const usecase = new CreateAccountUsecase();
    const account = await usecase.apply(args);

    appendAccount($("#accountsContainer"), account);

    emailInput.val("");

    button.removeAttr("disabled");
  });
});
