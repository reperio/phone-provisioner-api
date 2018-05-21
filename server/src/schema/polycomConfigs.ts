import {ObjectSchema, SchemaMap, object, string, bool, array, number} from 'joi';
import {possibleCodecPrefValues, possibleCallBackModeValues} from "./possibleListValues";

const timeRegex = /^\d?\d:\d\d$/;

export const polycomConfig: SchemaMap = {
    firmwareVersion: string()
};

export const soundpointIPConfig: SchemaMap = {
    digitMap: string(),
    tagSerialNo: bool(),
    oneTouchVoiceMail: bool(),
    ztpEnabled: bool(),
    presence: bool(),
    messaging: bool(),
    callWaiting: bool(),
    urlDialing: bool(),
    codecPref: array().items(string().valid(possibleCodecPrefValues)),
    mwi1_callBackMode: string().valid(possibleCallBackModeValues),
    mwi1_callBack: string(),
    mwi2_callBackMode: string().valid(possibleCallBackModeValues),
    mwi2_callBack: string(),
    mwi3_callBackMode: string().valid(possibleCallBackModeValues),
    mwi3_callBack: string(),
    mwi4_callBackMode: string().valid(possibleCallBackModeValues),
    mwi4_callBack: string(),
    mwi5_callBackMode: string().valid(possibleCallBackModeValues),
    mwi5_callBack: string(),
    mwi6_callBackMode: string().valid(possibleCallBackModeValues),
    mwi6_callBack: string(),
    pollingEnabled: bool(),
    pollingMode: string().valid(['abs', 'rel', 'random']),
    pollingPeriod: number().integer().min(1),
    pollingTime: string().regex(timeRegex),
    pollingTimeRandomEnd: string().regex(timeRegex),
    sntpAddress: string(),
    sntpGmtOffset: number().integer(),
    sntpResyncPeriod: number().integer().min(1),
    vadEnable: bool(),
    vadSignalAnnexB: bool(),
    vadThresh: number().integer().min(0).max(30),
    volumePersistHandset: bool(),
    volumePersistHeadset: bool(),
    volumePersistHandsFree: bool()
}

export const soundpointIP330Config: SchemaMap = {

}

export const soundpointIP331Config: SchemaMap = {
    urlModeDialing: bool()
}

export const soundpointIP335Config: SchemaMap = {
    urlModeDialing: bool()
}

export const soundpointIP670Config: SchemaMap = {
    bypassInstantMessage: bool()
}

export const soundpointIP6000Config: SchemaMap = {
    bypassInstantMessage: bool()
}