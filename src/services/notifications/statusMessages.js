import { AppToaster } from './toaster';
import i18n from "i18next";

export function updateReady() {
    let message = 'New Version Cached: Close Tab or Browser and Re-open to Update';
    AppToaster.show({ icon: 'info-sign', intent: 'success', message }); 
};

export function popupsBlocked() {
    let message = `${i18n.t('phrases.blocked')}. ${i18n.t('phrases.enablepopups')}`;
    return AppToaster.show({ icon: 'error', intent: 'error', message }); 
}
/*
function enableNotifications() {
    // TODO: future, once server and service workers implemented...
    // Notification.requestPermission(granted => { env.notifications = granted; });
}
*/
