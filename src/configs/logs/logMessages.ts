import configFile from '../config.json';
import pino from 'pino';

const logger = pino();

export function WarningLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_warning_logs) return;
  
  let filteredMessage: string = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  
  return logger.warn(`${functionName}: ${messageDescription}${filteredMessage}`);
}

export function ErrorLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_error_logs) return;
  
  let filteredMessage = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  
  return logger.error(`${functionName}: ${messageDescription}${filteredMessage}`);
}

export function InfoLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_info_logs) return;
  
  let filteredMessage = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  
  return logger.info(`${functionName}: ${messageDescription}${filteredMessage}`);
}

export function DebugLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_debug_logs) return;
  
  let filteredMessage = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  
  return logger.info(`${functionName}: ${messageDescription}${filteredMessage}`);
}

export function SuccessLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_success_logs) return;
  
  let filteredMessage = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  
  return logger.info(`${functionName}: ${messageDescription}${filteredMessage}`);
}

export function FatalLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_fatal_logs) return;
  
  let filteredMessage = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  
  return logger.fatal(`${functionName}: ${messageDescription}${filteredMessage}`);
}

export function CriticalLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_critical_logs) return;
  
  let filteredMessage = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  
  return logger.fatal(`${functionName}: ${messageDescription}${filteredMessage}`);
}


export function ApiLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_api_logs) return;
  
  let filteredMessage = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  return logger.info(`${functionName}: ${messageDescription}${filteredMessage}`);
}

export function WebSocketLogMessage(functionName: string, messageDescription: string, filter = {}) {
  if (!configFile.api_log_message.enable_websocket_logs) return;
  
  let filteredMessage = '';
  if (Object.keys(filter).length > 0) {
    filteredMessage = ` - ${JSON.stringify(filter)}`;
  }
  return logger.info(`${functionName}: ${messageDescription}${filteredMessage}`);
}
