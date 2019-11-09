import * as $ from "jquery";
import {
  doThen,
  getProjectId,
  isShowingError,
  isForbiddenError,
  isAutoSwitchEnabled
} from "./utility";
import { ListAccountsUsecase } from "./usecase/list_accounts_usecase";
import { DeleteProjectAssociationsUsecase } from "./usecase/delete_project_associations_usecase";
import { SwitchAccountUsecase } from "./usecase/switch_account_usecase";

const showSwitcherIfRequired = () => {
  doThen(isShowingError, () => {
    if (isForbiddenError()) {
      const listAccountsUsecase = new ListAccountsUsecase();
      listAccountsUsecase
        .apply({})
        .then(accounts => {
          const switcher = $(
            '<div style="margin-left: auto; display: flex; align-items: center;" name="firebase-project-switcher-email"></div>'
          );

          accounts
            .map(account => {
              const div = $('<div style="font-size: 10pt"></div>');

              div.click(async () => {
                div.attr("disabled", `${true}`);

                const deleteProjectAssociationsUsecase = new DeleteProjectAssociationsUsecase();

                await deleteProjectAssociationsUsecase.apply({
                  projectId: getProjectId()
                });

                div.removeAttr("disabled");

                const switchAccountUsecase = new SwitchAccountUsecase();
                await switchAccountUsecase.apply({
                  email: account.email,
                  projectId: getProjectId()
                });
              });

              div.append(account.email);
              return div;
            })
            .forEach(item => switcher.append(item));

          const openOptions = $(
            '<button class="md-raised md-primary md-button" type="button"></button>'
          );
          openOptions.text("Add");
          openOptions.click(() => {
            chrome.runtime.sendMessage({
              action: "openOptionsPage"
            });
          });

          switcher.append(openOptions);
          $("md-toolbar").append(switcher);
        })
        .then(() => isAutoSwitchEnabled())
        .then(_enabled => {
          // TODO auto switch
          // if (enabled) {
          //   const switchAccountUsecase = new SwitchAccountUsecase();
          //   const switchAccountUsecaseArgs: SwitchAccountUsecaseArgs = {
          //     email: account.email,
          //     projectId: getProjectId()
          //   };
          //   switchAccountUsecase.apply(switchAccountUsecaseArgs);
          // }
        });
    }
  });
};

$(showSwitcherIfRequired);
