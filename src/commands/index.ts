// core
import ping from "./core/ping";
import commands from "./core/commands";
// moderation
import warn from "./moderation/warn";
import delwarn from "./moderation/delwarn";
import kick from "./moderation/kick";
import ban from "./moderation/ban";
import unban from "./moderation/unban";
import viewCase from "./moderation/case";
import lock from "./moderation/lock";
import unlock from "./moderation/unlock";
import setMutedRole from "./moderation/setMutedRole";
import setModeratorRole from "./moderation/setModeratorRole";
import setAdminRole from "./moderation/setAdminRole";
import viewGuildConfig from "./moderation/viewGuildConfig";
import mute from "./moderation/mute";
import unmute from "./moderation/unmute";
import modStats from "./moderation/modStats";
// custom
import create from "./custom/create";
import deleteCommand from "./custom/delete";

export default [
    ping,
    commands,
    
    warn,
    delwarn,
    kick,
    ban,
    unban,
    viewCase,
    lock,
    unlock,
    setMutedRole,
    setModeratorRole,
    setAdminRole,
    viewGuildConfig,
    mute,
    unmute,
    modStats,

    create,
    deleteCommand,
];