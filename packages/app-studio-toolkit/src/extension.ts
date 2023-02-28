import * as vscode from "vscode";
import { BasToolkit } from "@sap-devx/app-studio-toolkit-types";
import { baseBasToolkitAPI } from "./public-api/base-bas-api";
import { createBasToolkitAPI } from "./public-api/create-bas-toolkit-api";
import {
  startBasctlServer,
  closeBasctlServer,
} from "./basctlServer/basctlServer";
import { ActionsController } from "./actions/controller";
import { initLogger, getLogger } from "./logger/logger";
import { basAdapter as projectApiBasAdapter } from "@sap/artifact-management";

export function activate(context: vscode.ExtensionContext): BasToolkit {
  initLogger(context);

  startBasctlServer();

  ActionsController.loadContributedActions();

  ActionsController.performScheduledActions();

  void ActionsController.performActionsFromURL();

  const workspaceAPI = projectApiBasAdapter.getBasWorkspaceApi(vscode);
  const basToolkitAPI = createBasToolkitAPI(workspaceAPI, baseBasToolkitAPI);

  const logger = getLogger().getChildLogger({ label: "activate" });
  logger.info("The App-Studio-Toolkit Extension is active.");

  return basToolkitAPI;
}

export function deactivate() {
  closeBasctlServer();
}
