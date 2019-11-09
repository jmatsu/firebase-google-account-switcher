import * as $ from "jquery";
import {
  doThen,
  getProjectId,
  isShowingError,
  isForbiddenError
} from "./utility";
import { ListAccountsUsecase } from "./usecase/list_accounts_usecase";
import { DeleteProjectAssociationsUsecase } from "./usecase/delete_project_associations_usecase";
import { SwitchAccountUsecase } from "./usecase/switch_account_usecase";

import "../css/content_script.scss";

const showSwitcherIfRequired = () => {
  doThen(isShowingError, async () => {
    if (isForbiddenError()) {
      const listAccountsUsecase = new ListAccountsUsecase();
      const accounts = await listAccountsUsecase.apply({});

      $("md-toolbar").append(
        $(`
      <div id="firebase-account-switcher">
      <div class="drop-menu-anchor">
        <button class="open-drop-menu">SWITCH ACCOUNT</button>
        <div id="switcher-content" class="drop-menu-content drop-menu-content-hidden">
          <div id="accounts-container">
            <!-- Accounts -->
          </div>
          <button id="open-options-page">ADD NEW ACCOUNT</button>
        </div>
        </div>
      </div>
    `)
      );
      const switcher = $("md-toolbar").find("#firebase-account-switcher");

      const switcherContent = switcher.find("#switcher-content");

      switcher.find(".open-drop-menu").click(async () => {
        if (switcherContent.hasClass("drop-menu-content-hidden")) {
          switcherContent.removeClass("drop-menu-content-hidden");
          switcherContent.addClass("drop-menu-content-show");

          if (!switcherContent.hasClass("position-adjusted")) {
            switcherContent.addClass("position-adjusted");
            switcherContent.css({
              left: `-${switcherContent.width() -
                switcher.find(".open-drop-menu").innerWidth()}px`
            });
          }
        } else {
          switcherContent.removeClass("drop-menu-content-show");
          switcherContent.addClass("drop-menu-content-hidden");
        }
      });

      const accountsContainer = switcher.find("#accounts-container");

      accounts.forEach(account => {
        const item = $('<p class="account-row"></p>');

        item.click(async () => {
          switcherContent.addClass("drop-menu-content-hidden");

          const deleteProjectAssociationsUsecase = new DeleteProjectAssociationsUsecase();

          await deleteProjectAssociationsUsecase.apply({
            projectId: getProjectId()
          });

          const switchAccountUsecase = new SwitchAccountUsecase();
          await switchAccountUsecase.apply({
            email: account.email,
            projectId: getProjectId()
          });
        });

        item.text(account.email);
        accountsContainer.append(item);
      });

      switcher.find("#open-options-page").click(() => {
        chrome.runtime.sendMessage({
          action: "openOptionsPage"
        });
      });
    }
  });
};

$(showSwitcherIfRequired);
