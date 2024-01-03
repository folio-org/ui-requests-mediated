import { MODULE_ROUTE } from './base';

export const CONFIRM_ITEM_ARRIVAL = 'confirm-item-arrival';
export const MEDIATED_REQUESTS_ACTIVITIES = 'mediated-requests-activities';
export const SEND_ITEM_IN_TRANSIT = 'send-item-in-transit';

export const getConfirmItemArrivalUrl = () => (`/${MODULE_ROUTE}/${CONFIRM_ITEM_ARRIVAL}`);
export const getMediatedRequestsActivitiesUrl = () => (`/${MODULE_ROUTE}/${MEDIATED_REQUESTS_ACTIVITIES}`);
export const getSendItemInTransitUrl = () => (`/${MODULE_ROUTE}/${SEND_ITEM_IN_TRANSIT}`);
