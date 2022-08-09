/**
* checks if Push notification and service workers are supported by your browser
*/
function isPushNotificationSupported() {
    return "serviceWorker" in navigator && "PushManager" in window;
}

/**
 * asks user consent to receive push notifications and returns the response of the user, one of granted, default, denied
 */
function initializePushNotifications() {
    // request user grant to show notification
    return Notification.requestPermission(function (result) {
        return result;
    });
}
/**
 * shows a notification
 */
function sendNotification() {
    const img = "/icons/icon-192.png";
    const text = "Take a look at this brand new t-shirt!";
    const title = "New Product Available";
    const options = {
        body: text,
        icon: "/icons/icon-192.png",
        vibrate: [200, 100, 200],
        tag: "new-product",
        image: img,
        badge: "/icons/icon-192.png",
        actions: [{ action: "Detail", title: "View", icon: "https://via.placeholder.com/128/ff0000" }]
    };
    navigator.serviceWorker.ready.then(function (serviceWorker) {
        serviceWorker.showNotification(title, options);
    });
}

/**
 * 
 */
function registerServiceWorker() {
    navigator.serviceWorker.register("/sw.js").then(function (swRegistration) {
        //you can do something with the service wrker registration (swRegistration)
    });
}

export {
    isPushNotificationSupported,
    initializePushNotifications,
    registerServiceWorker,
    sendNotification
};