const pick = (obj, keys) => {
    const fielderObj = {};
    for (const key of keys) {
        if (obj && Object.hasOwnProperty.call(obj, key)) {
            fielderObj[key] = obj[key];
        }
    }
    return fielderObj;
};
export default pick;
