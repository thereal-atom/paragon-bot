// core
import ping from "./core/ping";
// moderation
import warn from "./moderation/warn";
import delwarn from "./moderation/delwarn";
import kick from "./moderation/kick";
import ban from "./moderation/ban";
import unban from "./moderation/unban";
import viewCase from "./moderation/case";
import create from "./custom/create";
import deleteCommand from "./custom/delete";

export default [
    ping,
    warn,
    delwarn,
    kick,
    ban,
    unban,
    viewCase,
    create,
    deleteCommand,
];