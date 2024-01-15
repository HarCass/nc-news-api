"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.convertTimestampToDate = void 0;
function convertTimestampToDate(data) {
    if (!data.created_at)
        return Object.assign({}, data);
    return Object.assign(Object.assign({}, data), { created_at: new Date(data.created_at) });
}
exports.convertTimestampToDate = convertTimestampToDate;
;
