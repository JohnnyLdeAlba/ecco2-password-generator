/*
 *  MIT License
 *
 *  Reverse Engineered by Johnny L. de Alba (Arkonviox), 2020
 *  Copyright (c) 2020. Novotrade International and Sega Games Co., Ltd.
 *
 *  Permission is hereby granted, free of charge, to any person 
 *  obtaining a copy of this software and associated documentation 
 *  files (the "Software"), to deal in the Software without 
 *  restriction, including without limitation the rights to use, 
 *  copy, modify, merge, publish, distribute, sublicense, and/or 
 *  sell copies of the Software, and to permit persons to whom the
 *  Software is furnished to do so, subject to the following 
 *  conditions:
 *
 *  The above copyright notice and this permission notice shall be
 *  included in all copies or substantial portions of the 
 *  Software.
 *
 *  THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY 
 *  KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE 
 *  WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR 
 *  PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR 
 *  COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
 *  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR 
 *  OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE 
 *  SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
 *
 *  Project Blue Dream 
 *
 *  Ecco 2 Password Encryption Library
 *  Version: 0.00.06262021
 *
 *  Game: Ecco 2: The Tides of Time, US/Europe
 *  Platform: Sega Genesis/Mega Drive/Sega CD
 *
 *  Summary: A set of encrption tools for generator Ecco 2 passwords.
 *
 */

const ECCO_INVALIDPASS_CHARLEN = -1;
const ECCO_INVALIDPASS_ALPHAONLY = -2;
const ECCO_INVALIDPASS_CHECKSUM = -3;

const ECCO1_INVALIDPASS_VORTEX = -4;

const ECCO1_MEGADRIVE = 0;
const ECCO1JP_MEGADRIVE = 1;
const ECCO1_SEGACD = 2;
const ECCO2_MEGADRIVE = 3;

const EC1_UNLIMITED_AIR = 0x80;

const EC1_GLOBE_OBTAINED = 0x3;
const EC1_GLOBE_OBTAINED_MASK = 0x7

const EC1_GLOBE_OBTAINED_RED = 0x1;
const EC1_GLOBE_OBTAINED_BROWN = 0x2;
const EC1_GLOBE_OBTAINED_PURPLE = 0x3;
const EC1_GLOBE_OBTAINED_GREEN = 0x4;

const EC1_GLOBE_OBTAINED_PURPLE5 = 0x5;
const EC1_GLOBE_OBTAINED_PURPLE6 = 0x6;
const EC1_GLOBE_OBTAINED_PURPLE7 = 0x7;

const EC1_CHARGE_SONAR = 0x10;
const EC1_PERMA_KILL = 0x08;

const EC1_TMACHINE_JURASSIC = 0x0;
const EC1_TMACHINE_HOMEBAY = 0x2;
const EC1_STORM_VORTEX = 0x4;

const EC1_STAGE_EVENT_6 = 0x6;

const ECCO1_MASK_STAGEID = 0x000000ff;
const ECCO1_MASK_STAGEFLAGS = 0xffffff00; 

const ECCO1_UNLIMITED_AIR = 1 << 8;

const ECCO1_GLOBE_OBTAINED = 1 << 11;

const ECCO1_GLOBE_OBTAINED_RED = 1 << 9;
const ECCO1_GLOBE_OBTAINED_BROWN = 1 << 10;
const ECCO1_GLOBE_OBTAINED_PURPLE = 1 << 11;
const ECCO1_GLOBE_OBTAINED_GREEN = 1 << 12;
const ECCO1_GLOBE_OBTAINED_PURPLE5 = 1 << 13;
const ECCO1_GLOBE_OBTAINED_PURPLE6 = 1 << 14;
const ECCO1_GLOBE_OBTAINED_PURPLE7 = 1 << 15;

const ECCO1_GLOBE_OBTAINED_MASK = ECCO1_GLOBE_OBTAINED_RED | ECCO1_GLOBE_OBTAINED_BROWN | ECCO1_GLOBE_OBTAINED_PURPLE | 
	ECCO1_GLOBE_OBTAINED_GREEN | ECCO1_GLOBE_OBTAINED_PURPLE5 | ECCO1_GLOBE_OBTAINED_PURPLE6 | ECCO1_GLOBE_OBTAINED_PURPLE7;
const ECCO1_GLOBE_OBTAINED_DEFAULT_MASK = ECCO1_GLOBE_OBTAINED_RED | ECCO1_GLOBE_OBTAINED_BROWN | ECCO1_GLOBE_OBTAINED_PURPLE | ECCO1_GLOBE_OBTAINED_GREEN;

const ECCO1_TMACHINE_JURASSIC = 1 << 16;
const ECCO1_TMACHINE_HOMEBAY = 1 << 17;
const ECCO1_STORM_VORTEX = 1 << 18;
const ECCO1_STAGE_EVENT_6 = 1 << 19;

const ECCO1_STAGE_EVENT_MASK = ECCO1_TMACHINE_JURASSIC | ECCO1_TMACHINE_HOMEBAY | ECCO1_STORM_VORTEX | ECCO1_STAGE_EVENT_6;

const ECCO1_CHARGE_SONAR = 1 << 20;
const ECCO1_PERMA_KILL = 1 << 21;

const ECCO1_SELECTIONSCR = 28
const ECCO1_UNDERCAVES = 1 | ECCO1_TMACHINE_JURASSIC;
const ECCO1_THEVENTS = 2 | ECCO1_TMACHINE_JURASSIC;
const ECCO1_THELAGOON = 3 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR;
const ECCO1_RIDGEWATER = 5 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_OPENOCEAN1 = 8 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_ICEZONE = 26 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;;
const ECCO1_HARDWATER = 25 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_COLDWATER = 24 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_ISLANDZONE = 4 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_DEEPWATER = 6;
const ECCO1_DEEPWATER1 = 6 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1_THEMARBLESEA = 21 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_THELIBRARY = 22 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_DEEPCITY = 20 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_CITYOFFOREVER = 23;
const ECCO1_CITYOFFOREVER1 = 23 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1_JURASSICBEACH = 12 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_PTERANODONPOND = 13 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_ORIGINBEACH = 14 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_TRILOBITECIRCLE = 15 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_DARKWATER = 16 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_DEEPWATER2 = 6 | ECCO1_TMACHINE_HOMEBAY | ECCO1_GLOBE_OBTAINED | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_CITYOFFOREVER2 = 23 | ECCO1_TMACHINE_HOMEBAY | ECCO1_UNLIMITED_AIR | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1_THETUBE = 18 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR| ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_THEMACHINE = 17 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR| ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_THELASTFIGHT = 27 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR| ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1_SCENARIO_DEEPWATER_FINDGLOBE = (ECCO1_DEEPWATER & ECCO1_MASK_STAGEID) | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;;
const ECCO1_SCENARIO_DEEPWATER_RETURNGLOBE = (ECCO1_DEEPWATER & ECCO1_MASK_STAGEID) | ECCO1_GLOBE_OBTAINED | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_SCENARIO_CITYOFFOREVER_TOJURASSIC = (ECCO1_CITYOFFOREVER & ECCO1_MASK_STAGEID) | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_SCENARIO_CITYOFFOREVER_TOHOMEBAY = (ECCO1_CITYOFFOREVER & ECCO1_MASK_STAGEID) | ECCO1_UNLIMITED_AIR | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1_SCENARIO_ASTERITE_INCOMPLETE = ECCO1_SCENARIO_DEEPWATER_FINDGLOBE;
const ECCO1_SCENARIO_TMACHINE_JURASSIC = ECCO1_SCENARIO_CITYOFFOREVER_TOJURASSIC;
const ECCO1_SCENARIO_TMACHINE_HOMEBAY = ECCO1_SCENARIO_CITYOFFOREVER_TOHOMEBAY;

const ECCO1_SCENARIO_STORM_DROPBACK = (ECCO1_SELECTIONSCR & ECCO1_MASK_STAGEID) | ECCO1_TMACHINE_JURASSIC;
const ECCO1_SCENARIO_STORM_VORTEX = (ECCO1_SELECTIONSCR & ECCO1_MASK_STAGEID) | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1_SCENARIO_ASTERITECOMPLETE_NOEXITSTAGE = (ECCO1_DEEPWATER & ECCO1_MASK_STAGEID) | ECCO1_TMACHINE_JURASSIC | ECCO1_UNLIMITED_AIR;
const ECCO1_SCENARIO_ASTERITECOMPLETE_TRAPPEDINCAVE = (ECCO1_DEEPWATER & ECCO1_MASK_STAGEID) | ECCO1_TMACHINE_JURASSIC | ECCO1_UNLIMITED_AIR | ECCO1_GLOBE_OBTAINED;
const ECCO1_SCENARIO_TMACHINE_TITLESCREEN = (ECCO1_CITYOFFOREVER & ECCO1_MASK_STAGEID) | ECCO1_TMACHINE_HOMEBAY;
const ECCO1_SCENARIO_TMACHINE_DOESNTWORK = (ECCO1_CITYOFFOREVER & ECCO1_MASK_STAGEID) | ECCO1_TMACHINE_JURASSIC | ECCO1_GLOBE_OBTAINED;
const ECCO1_SCENARIO_PREASTERITE_COMMUNICATES = (ECCO1_DARKWATER & ECCO1_MASK_STAGEID) | ECCO1_UNLIMITED_AIR | ECCO1_TMACHINE_HOMEBAY;

const ECCO1JPMD_SELECTIONSCR = 30 | ECCO1_TMACHINE_JURASSIC;
const ECCO1JPMD_UNDERCAVES = 1 | ECCO1_TMACHINE_JURASSIC;
const ECCO1JPMD_THEVENTS = 2 | ECCO1_TMACHINE_JURASSIC;
const ECCO1JPMD_THELAGOON = 3 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR;
const ECCO1JPMD_RIDGEWATER = 5 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_OPENOCEAN1 = 8 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_ICEZONE = 28 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;;
const ECCO1JPMD_HARDWATER = 27 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_COLDWATER = 26 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_OPENOCEAN2 = 12 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1JPMD_ISLANDZONE = 4 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_DEEPWATER1 = 6 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1JPMD_THEMARBLESEA = 23 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_THELIBRARY = 24 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_DEEPCITY = 22 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_CITYOFFOREVER1 = 25 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1JPMD_JURASSICBEACH = 13 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_PTERANODONPOND = 14 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_ORIGINBEACH = 15 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_TRILOBITECIRCLE = 16 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_DARKWATER = 17 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_DEEPWATER2 = 6 | ECCO1_TMACHINE_HOMEBAY | ECCO1_GLOBE_OBTAINED | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_CITYOFFOREVER2 = 25 | ECCO1_TMACHINE_HOMEBAY | ECCO1_UNLIMITED_AIR | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1JPMD_THETUBE = 19 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_THEMACHINE = 18 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR| ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_THESTOMACH = 21 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR| ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1JPMD_THELASTFIGHT = 29 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR| ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1CD_UNDERCAVES = 1 | ECCO1_TMACHINE_JURASSIC;
const ECCO1CD_THEVENTS = 2 | ECCO1_TMACHINE_JURASSIC;
const ECCO1CD_THELAGOON = 3 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR;
const ECCO1CD_RIDGEWATER = 5 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_OPENOCEAN1 = 8 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_ICEZONE = 27 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;;
const ECCO1CD_HARDWATER = 26 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_COLDWATER = 25 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_ISLANDZONE = 4 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_DEEPWATER1 = 6 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1CD_DEEPGATE = 31 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_SHIPGRAVESEA = 29 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_WRECKTRAP = 30 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_SEAOFSILENCE = 32 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_VOLCANICREEF = 10 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1CD_THEMARBLESEA = 22 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_THELIBRARY = 23 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_DEEPCITY = 21 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_CITYOFFOREVER1 = 24 | ECCO1_TMACHINE_JURASSIC | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1CD_JURASSICBEACH = 13 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_PTERANODONPOND = 14 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_ORIGINBEACH = 15 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_TRILOBITECIRCLE = 16 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_DARKWATER = 17 | ECCO1_TMACHINE_HOMEBAY | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_DEEPWATER2 = 6 | ECCO1_TMACHINE_HOMEBAY | ECCO1_GLOBE_OBTAINED | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_CITYOFFOREVER2 = 24 | ECCO1_TMACHINE_HOMEBAY | ECCO1_UNLIMITED_AIR | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;

const ECCO1CD_THETUBE = 19 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR | ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_THEMACHINE = 18 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR| ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;
const ECCO1CD_THELASTFIGHT = 28 | ECCO1_STORM_VORTEX | ECCO1_UNLIMITED_AIR| ECCO1_CHARGE_SONAR | ECCO1_PERMA_KILL;


const ECCO2_STAGE_ID_MASK = 0x000000ff;

const ECCO2_HOMEBAY = (0x00000001 << 8) | 14;
const ECCO2_CRYSTALSPRINGS = (0x00000001 << 8) | 16;
const ECCO2_FAULTZONE = (0x00000001 << 8) | 17;
const ECCO2_TWOTIDES = (0x00000001 << 8) | 9;
const ECCO2_TRELLIASBAY = (0x00000001 << 8) | 19;
const ECCO2_SKYWAY = (0x00000001 << 8) | 20;
const ECCO2_SKYTIDES = (0x00000001 << 8) | 28;
const ECCO2_TUBEOFMEDUSA = (0x00000001 << 8) | 25;
const ECCO2_AQUATUBEWAY = (0x00000001 << 8) | 27;
const ECCO2_SKYLANDS = (0x00000001 << 8) | 24;
const ECCO2_FINTOFEATHER = (0x00000001 << 8) | 23;
const ECCO2_EAGLESBAY = (0x00000001 << 8) | 22;
const ECCO2_ASTERITESCAVE = (0x00000001 << 8) | 21;
const ECCO2_THELOSTORCAS = (0x00000001 << 8) | 10;
const ECCO2_MAZEOFSTONE = (0x00000001 << 8) | 13;
const ECCO2_FOURISLANDS = (0x00000001 << 8) | 12;
const ECCO2_SEAOFDARKNESS = (0x00000001 << 8) | 15;
const ECCO2_VENTSOFMEDUSA = (0x00000001 << 8) | 11;
const ECCO2_GATEWAY = (0x00000001 << 8) | 18;
const ECCO2_SEAOFGREEN = (0x00000001 << 8) | 0;
const ECCO2_MORAYABYSS = (0x00000001 << 8) | 29;
const ECCO2_ASTERITESHOME = (0x00000001 << 8) | 30;
const ECCO2_SEAOFBIRDS = (0x00000001 << 8) | 3;
const ECCO2_THEEYE = (0x00000007 << 8) | 2;
const ECCO2_BIGWATER = (0x00001fff << 8) | 46;
const ECCO2_DEEPRIDGE = (0x00003fff << 8) | 1;
const ECCO2_THEHUNGRYONES = (0x007fffff << 8) | 5;
const ECCO2_SECRETCAVE = (0x007ffffff << 8) | 4;
const ECCO2_LUNARBAY = (0x007fffff << 8) | 38;
const ECCO2_VORTEXFUTURE = (0x007fffff << 8) | 36;
const ECCO2_BLACKCLOUDS = (0x007fffff << 8) | 35;
const ECCO2_GRAVITORBOX = (0x007fffff << 8) | 37;
const ECCO2_GLOBEHOLDER = (0x007fffff << 8) | 7;
const ECCO2_CONVERGENCE = (0x007fffff << 8) | 6;
const ECCO2_DARKSEA = (0x007fffff << 8) | 39;
const ECCO2_NEWMACHINE = (0x007fffff << 8) | 40;
const ECCO2_VORTEXQUEEN = (0x01ffffff << 8) | 45;
const ECCO2_THEPOD = (0x01ffffff << 8) | 47;
const ECCO2_EPILOGUE = (0x007fffff << 8) | 31;
const ECCO2_ATLANTIS = (0x007fffff << 8) | 32;
const ECCO2_FISHCITY = (0x007fffff << 8) | 33;
const ECCO2_CITYOFFOREVER = (0x007fffff << 8) | 34;
const ECCO2_SECRETPASSWORD = (0x007fffff << 8) | 63;
const ECCO2_INER = (0x01ffffff << 8) | 42;
const ECCO2_INNUENDO = (0x01ffffff << 8) | 43;
const ECCO2_TRANS = (0x01ffffff << 8) | 44;
const ECCO2_INSIDE = (0x01ffffff << 8) | 41;

const ECCO2_DIFFICULTY_EASY = 0x1;
const ECCO2_DIFFICULTY_HARD = 0x1 << 1;
const ECCO2_DIFFICULTY_NORMAL = 0;

const password_keys = [
	0x16, 0x08, 0x01, 0x0f, 0x02, 0x07, 0x14, 0x09,
	0x0d, 0x19, 0x17, 0x0a, 0x00, 0x0b, 0x04, 0x0c, 
	0x06, 0x0e, 0x05, 0x10, 0x13, 0x11, 0x03, 0x15,
	0x12, 0x18, 0x0c, 0x02, 0x04, 0x16, 0x0e, 0x12];

const password_decryption_keys = [
	0x0c, 0x02, 0x04, 0x16, 0x0e, 0x12, 0x10, 0x05,
	0x01, 0x07, 0x0b, 0x0d, 0x0f, 0x08, 0x11, 0x03,
	0x13, 0x15, 0x18, 0x14, 0x06, 0x17, 0x00, 0x0a,
	0x19, 0x09, 0x00, 0x01, 0x00, 0x0e, 0x00, 0x03];

const character_table = [
	'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 
	'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
	'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

function get_character_code(character)
{
	let index = 0;
	let total = character_table.length;
	let result = 0;
	
	for (index; index < total; index++)
	{
		result = character_table[index];

                if (character == ' ')
                    return 0x1a;
		else if (result == character)
		    return index;
	}
	
	return -1;
}

function ecco1_create_password_record()
{
	let password_record = new Object();

        password_record.result = 0;
	
	password_record.password = "";
	password_record.checksum = "";
	
	password_record.stage_id = 0;
	password_record.flags = 0;
	
	password_record.death_counter = 0;
	password_record.time_elapsed = 0;
	password_record.unencrypted_data = 0;
	
	return password_record;
}

function ecco1_pack_data(
	stage_id,
	flags,
	death_counter,
	time_elapsed)
{
	let data = 0;
	let global_event = 0;
	let globe_obtained = 0;
	let stage_event = 0;
	let special_abilities = 0;
	
	// DEBUG Expects 32-bit value = 0xffffffff
	time_elapsed = time_elapsed >>> 6;
	if (time_elapsed >= 0xffff)
		time_elapsed = 0xffff;
	time_elapsed = time_elapsed & 0xffff;
	
	data = data | time_elapsed;
	
	stage_id = stage_id - 1;
	stage_id = stage_id << 16;
	
	data = data | stage_id;

	if (flags & ECCO1_UNLIMITED_AIR)
		global_event|= (EC1_UNLIMITED_AIR >>> 4);

	globe_obtained = flags & ECCO1_GLOBE_OBTAINED_MASK;

	if (globe_obtained == ECCO1_GLOBE_OBTAINED_RED)
		global_event|= EC1_GLOBE_OBTAINED_RED;
	else if (globe_obtained == ECCO1_GLOBE_OBTAINED_BROWN)
		global_event|= EC1_GLOBE_OBTAINED_BROWN;
	else if (globe_obtained == ECCO1_GLOBE_OBTAINED_PURPLE)
		global_event|= EC1_GLOBE_OBTAINED_PURPLE;
	else if (globe_obtained == ECCO1_GLOBE_OBTAINED_GREEN)
		global_event|= EC1_GLOBE_OBTAINED_GREEN;
	else if (globe_obtained == ECCO1_GLOBE_OBTAINED_PURPLE5)
		global_event|= EC1_GLOBE_OBTAINED_PURPLE5;
	else if (globe_obtained == ECCO1_GLOBE_OBTAINED_PURPLE6)
		global_event|= EC1_GLOBE_OBTAINED_PURPLE6;
	else if (globe_obtained == ECCO1_GLOBE_OBTAINED_PURPLE7)
		global_event|= EC1_GLOBE_OBTAINED_PURPLE7;
	
	global_event = global_event & 0xf;
	global_event = global_event << 16;
	global_event = global_event << 5;

	data = data | global_event;

        switch (flags & ECCO1_STAGE_EVENT_MASK)
        {
	    case ECCO1_TMACHINE_JURASSIC:
                stage_event = EC1_TMACHINE_JURASSIC;
                break;

	    case ECCO1_TMACHINE_HOMEBAY:
	        stage_event = EC1_TMACHINE_HOMEBAY;
                break;

	    case ECCO1_STORM_VORTEX:
		stage_event = EC1_STORM_VORTEX;
                break;

            case ECCO1_STAGE_EVENT_6:
		stage_event = EC1_STAGE_EVENT_6;
                break;
        }
	
	stage_event = stage_event >>> 1;
	stage_event = stage_event << 16;
	stage_event = stage_event << 9;
	
	data = data | stage_event;
	
	if (flags & ECCO1_CHARGE_SONAR)
		special_abilities|= EC1_CHARGE_SONAR;
	if (flags & ECCO1_PERMA_KILL)
		special_abilities|= EC1_PERMA_KILL;

	special_abilities|= death_counter & 0x7;
	
	special_abilities = special_abilities & 0x1f;
	special_abilities = special_abilities << 16;
	special_abilities = special_abilities << 11;

	data = data | special_abilities;
	
	return data;
}

function ecco1_generate_password(
	stage_id,
	flags,
	death_counter,
	time_elapsed,
	version)
{
	let index = 0;
	
	let data = 0;
	let encrypted_data = 0;
	
	let password_char_code = [0,0,0,0,0,0,0,0];
	let password = "";
	let password_checksum = 0;
	
	let password_record = ecco1_create_password_record();

	stage_id = stage_id & 0x000000ff;
	flags = flags & 0xffffff00;

	data =  ecco1_pack_data(
		stage_id,
		flags,
		death_counter,
		time_elapsed);
	
	// JAVASCRIPT HACK
	data = data >>> 0;
	
	if (version == ECCO1_SEGACD)
		encrypted_data = data ^ 0x17652347;
	else if (version == ECCO1JP_MEGADRIVE)
		encrypted_data = data ^ 0x166a3172;
	else encrypted_data = data ^ 0x16402042;
	
	// JAVASCRIPT HACK
	encrypted_data = encrypted_data >>> 0;
	
	while (index < 7)
	{
		password_char_code[index] = ecco2_extract_character_code(encrypted_data);
		password_checksum+= password_char_code[index];

		encrypted_data = Math.trunc(encrypted_data/26);
		
		index++;
	}
	
	password_checksum = (password_checksum & 0x0000ffff) % 26;
	password_char_code[7] = password_checksum;
	
	for (index = 0; index < 8; index++)
		password+= character_table[password_char_code[index]];
	
	password_record.password = password;
	password_record.checksum = character_table[password_checksum];
	password_record.unencrypted_data = data;
	
	return password_record;
}

// 4627:28627
function _unknown1()
{
	let cbf0 = 0; // stage_id
}

// 46fe:c5fe
function _unknown2()
{
	let password_char_code = [0,0,0,0,0];
	let password_encrypted_code = [0,0,0,0];
	let random_seed = 0;
	let password_sum = 0;
	
	// total pairs = 15
	let globe_pairs = 0;
	let stage_id = 4;
	let index = 0;
	
	random_seed = Math.floor(Math.random() * 0x80) & 0x7f;
	index = random_seed & 0x3;
	
	password_char_code[4] = (globe_pairs & 0x4) | index;
	password_sum = password_char_code[4];
	
	random_seed = (random_seed + 0x96) & 0x7f;
	password_encrypted_code[0] = (random_seed & 0x4) | (stage_id & 0x11);
	password_sum+= password_encrypted_code[0];
	
	random_seed = (random_seed + 0x18) & 0x7f;
	password_encrypted_code[1] = (random_seed & 0x4) | ((stage_id & 0x2) | (globe_pairs & 0x8));
	password_sum+= password_encrypted_code[1];
	
	random_seed = (random_seed + 0x98)  & 0x7f;
	password_encrypted_code[2] = (random_seed & 0x2) | ((stage_id & 0x8) | (globe_pairs & 0x1));
	password_sum+= password_encrypted_code[2];
	
	random_seed = (random_seed + 0x98)  & 0x7f;
	password_encrypted_code[3] = (random_seed & 0x1) | ((stage_id & 0x4) | (globe_pairs & 0x2));
	password_sum+= password_encrypted_code[3];
	
	password_char_code[index] = (password_sum & 0x2) | password_encrypted_code[0];
	
	index = (index + 1) & 3;
	password_char_code[index] = (password_sum & 0x1) | password_encrypted_code[1];
	
	index = (index + 1) & 3;
	password_char_code[index] = (password_sum & 0x4) | password_encrypted_code[2];
	
	index = (index + 1) & 3;
	password_char_code[index] = (password_sum & 0x10) | password_encrypted_code[3];
	
	password_char_code[4] = (password_sum & 0x8) | password_char_code[4];
	
	console.log(password_char_code);

	let password = ""
	for (index = 0; index < 5; index++)
		password+= character_table[password_char_code[index]];
		
	console.log(password);

	return password_char_code;
}

function ecco1_unpack_data(
	data,
	version)
{
	let stage_id = 0;
	let global_event = 0;
	let stage_event = 0;
	let globe_obtained = 0;
	let special_abilities = 0;

	let flags = 0;
	let death_counter = 0;
	let time_elapsed = 0;
	let password_record = ecco1_create_password_record();
	
	time_elapsed = data & 0xffff;
	
	stage_id = (data >>> 16) & 0x1f;
	stage_id++;
	
	flags = stage_id;
	
	global_event = data >>> 16;
	global_event = global_event >>> 5;
	global_event = global_event & 0xf;

	if ((global_event << 4) & EC1_UNLIMITED_AIR)
		flags|= ECCO1_UNLIMITED_AIR;
	
	globe_obtained = global_event & EC1_GLOBE_OBTAINED_MASK;
	
	if (globe_obtained == EC1_GLOBE_OBTAINED_RED)
		flags|= ECCO1_GLOBE_OBTAINED_RED;
	else if (globe_obtained == EC1_GLOBE_OBTAINED_BROWN)
		flags|= ECCO1_GLOBE_OBTAINED_BROWN;
	else if (globe_obtained == EC1_GLOBE_OBTAINED_PURPLE)
		flags|= ECCO1_GLOBE_OBTAINED_PURPLE;
	else if (globe_obtained == EC1_GLOBE_OBTAINED_GREEN)
		flags|= ECCO1_GLOBE_OBTAINED_GREEN;
	else if (globe_obtained == EC1_GLOBE_OBTAINED_PURPLE5)
		flags|= ECCO1_GLOBE_OBTAINED_PURPLE5;
	else if (globe_obtained == EC1_GLOBE_OBTAINED_PURPLE6)
		flags|= ECCO1_GLOBE_OBTAINED_PURPLE6;
	else if (globe_obtained == EC1_GLOBE_OBTAINED_PURPLE7)
		flags|= ECCO1_GLOBE_OBTAINED_PURPLE7;
	
	stage_event = data >>> 9;
	stage_event = stage_event >>> 16;
	stage_event = stage_event << 1;
	stage_event&= 0x7;

        switch (stage_event)
        {
	    case EC1_TMACHINE_JURASSIC:
                flags|= ECCO1_TMACHINE_JURASSIC;
                break;

	    case EC1_TMACHINE_HOMEBAY:
	        flags|= ECCO1_TMACHINE_HOMEBAY;
                break;

	    case EC1_STORM_VORTEX:
		flags|= ECCO1_STORM_VORTEX;
                break;

            case EC1_STAGE_EVENT_6:
		flags|= ECCO1_STAGE_EVENT_6;
                break;
        }

	special_abilities = data >>> 16;
	special_abilities = special_abilities >>> 11;
	special_abilities = special_abilities & 0x1f;
	
	death_counter = special_abilities & 0x7;
	special_abilities = special_abilities & 0x18;
	
	if (special_abilities & EC1_CHARGE_SONAR)
		flags|= ECCO1_CHARGE_SONAR;
	if (special_abilities & EC1_PERMA_KILL)
		flags|= ECCO1_PERMA_KILL;
	
	password_record.stage_id = stage_id;
	password_record.flags = flags;
	password_record.death_counter = death_counter;
	password_record.time_elapsed = time_elapsed;
	password_record.data = data;
	
	return password_record;
}

function ecco1_decrypt_raw_password(password, version)
{
	let password_char = null;
	let password_char_code = [0,0,0,0,0,0,0,0];
	let password_checksum = 0;
	let password_record = ecco1_create_password_record();
	
	let index = 0;
	let key = 0;
	
	let remainder = 0;
	let product = 0;
	let x = 0, y = 0;
	
	let encrypted_data = 0;
	let data = 0;
	
	password = password.toUpperCase();
	password_char = password.split("");

	if (password_char.length != 8)
	{
		password_record.result = ECCO_INVALIDPASS_CHARLEN;
		return password_record;
	}
	
	for (index = 0; index < 8; index++)
	{
		password_char_code[index] = get_character_code(password_char[index]);
		if (password_char_code[index] == -1)
		{
			password_record.result = ECCO_INVALIDPASS_ALPHAONLY;
			return password_record;
		}
	}
	
	for (index = 0; index < 7; index++)
		password_checksum+= password_char_code[index];
	
	password_checksum = password_checksum % 26;
	password_record.checksum = character_table[password_checksum];

	if (password_char_code[7] != password_checksum)
	{
		password_record.result = ECCO_INVALIDPASS_CHECKSUM;
		return password_record;
	}
	
	x = 1;
	for (index = 0; index < 7; index++)
	{
		product = x * password_char_code[index];
		encrypted_data+= product;
		
		x+= x;
		y = x;
		x = x << 2;
		
		// JAVASCRIPT HACK
		x = x >>> 0;
		
		y+= x;
		x+= x;
		x+= y;
	}
	
	if (version == ECCO1_SEGACD)
		data = encrypted_data ^ 0x17652347;
	else if (version == ECCO1JP_MEGADRIVE)
		data = encrypted_data ^ 0x166a3172;
	else data = encrypted_data ^ 0x16402042;
	
	// JAVASCRIPT HACK
	data = data >>> 0;
	
	password_record = ecco1_unpack_data(data);
	password_record.checksum = character_table[password_checksum];
	password_record.unencrypted_data = data;
	
	return password_record;
}

function ecco1md_decrypt_password(password)
{
    return ecco1_decrypt_raw_password(password, ECCO1_MEGADRIVE);
}

function ecco1jpmd_decrypt_password(password)
{
    return ecco1_decrypt_raw_password(password, ECCO1JP_MEGADRIVE);
}

function ecco1cd_decrypt_password(password)
{
    return ecco1_decrypt_raw_password(password, ECCO1_SEGACD);
}

function ecco2_create_password_record()
{
	let password_record = new Object();

        password_record.error_id = 0;
	
	password_record.password = "";
	password_record.checksum = "";
	
	password_record.stage_id = 0;
	password_record.globe_pairs = 0;
        password_record.difficulty_points = 0;
        password_record.forced_easy_mode = 0;
        password_record.forced_hard_mode = 0;
        password_record.cheat_mode = 0;

	password_record.time_elapsed = 0;
	password_record.unencrypted_data = 0;
	
	return password_record;
}

function ecco2_get_globe_audit(stage_id)
{
    return (stage_id >>> 8) & 0x01ffffff;
}

function ecco2_count_globe_pairs(globe_audit_left, globe_audit_right)
{
	let mask = 0x80000000;
	let index = 0;
	let result = 0;
	
	let globe_pairs = 0;
	
	result = globe_audit_right;
	if (result != globe_audit_left)
	{
		globe_pairs = 0xff;
		return globe_pairs;
	}	
		
	for (index = 0; index < 32; index++)
	{
		result = mask & globe_audit_right;
		if (result != 0)
			globe_pairs++;
		
		mask = mask >>> 1;
	}
		
	return globe_pairs;
}

function ecco2_pack_difficulty(pr)
{
        let result = 0, data = 0;
        
        result = pr.difficulty_points & 0xf;
        result = result << 11;
        data|= result;

        result = pr.forced_easy_mode & 0x1;
        result = result << 15;
        data|= result;

        result = pr.forced_hard_mode & 0x1;
        result = result << 16;
        data|= result;

        console.log(data);

	return data;
}

function ecco2_unpack_difficulty(data, password_record)
{
	let difficulty_points = 0;
        let forced_easy_mode = 0;
        let forced_hard_mode = 0;
        let cheat_mode = 0;

        difficulty_points = data >>> 11;
        difficulty_points&= 0xf;

        forced_easy_mode = data >>> 15;
        forced_easy_mode&= 0x1;

        forced_hard_mode = data >>> 16;
        forced_hard_mode&= 0x1;

        cheat_mode = forced_easy_mode & forced_hard_mode;

        password_record.difficulty_points = difficulty_points;
        password_record.forced_easy_mode = forced_easy_mode;
        password_record.forced_hard_mode = forced_hard_mode;
        password_record.cheat_mode = cheat_mode;

	return password_record;
}

function ecco2_pack_data(pr)
{
	let result = 0, data = 0;
	
	result = ecco2_count_globe_pairs(
            pr.globe_pairs, pr.globe_pairs);

        pr.globe_pairs = result;

	result&= 0x1f;
	data = result & 0x1f;

	result = pr.stage_id & 0x3f;
	result = result << 5;
	data|= result;
	
	result = ecco2_pack_difficulty(pr);
	data|= result;

	result = pr.time_elapsed >>> 1;
        result = result << 17;
	data|= result;
	
	return data;
}

function ecco2_unpack_data(data, password_record)
{
	let globe_pairs = 0;

        ecco2_unpack_difficulty(data, password_record)
	globe_pairs = data & 0x1f;

	stage_id = data >> 5;
	stage_id = stage_id & 0x3f;

        time_elapsed = data & 0xffff0000;
	time_elapsed = time_elapsed >>> 17;
        time_elapsed = time_elapsed << 1;

        time_elapsed = time_elapsed << 4; // 1 Tick = 1024 Frames, Convert to 1 Tick = 64 Frames.
        time_elapsed = time_elapsed << 6; // Convert to 1 Tick = 1 Frame.

        password_record.stage_id = stage_id;
        password_record.globe_pairs = globe_pairs;
        password_record.time_elapsed = time_elapsed;
	
	return password_record;
}

function ecco2_32bit_encrypt(data)
{
	let key = 0x00000001;
	let hmask = 0x80000000;
	let lmask = 0x40000000;
	
	let encrpyted_data = 0;
	let index = 0;
	let result = 0;
	
	for (index = 0; index < 16; index++)
	{
		result = data & hmask;
		if (result != 0)
			encrpyted_data = encrpyted_data | key;
		
		result = data & lmask;
		if (result != 0)
			encrpyted_data = encrpyted_data | hmask;
		
		hmask  = hmask >>> 2;
		lmask = lmask >>> 2;
		
		key = key << 2;
	}
	
	encrpyted_data = encrpyted_data ^ 0x15b63c7a;
	return encrpyted_data;
}

function ecco2_32bit_decrypt(data)
{
	let key = 0x40000000;
	let hmask = 0x00000002;
	let lmask = 0x00000001;
	
	let decrypted_data = 0;
	let index = 0;
	let result = 0;
	
	data = data ^ 0x15b63c7a;
	
	for (index = 0; index < 16; index++)
	{
		result = data & key;
		if (result != 0)
			decrypted_data = decrypted_data | hmask;
		
		result = data & hmask;
		if (result != 0)
			decrypted_data = decrypted_data | lmask;
		
		hmask  = hmask << 2;
		lmask = lmask << 2;
		
		key = key >>> 2;
	}

	// JAVASCRIPT HACK
	decrypted_data = decrypted_data >>> 0;
	return decrypted_data;
}

function ecco2_extract_character_code(data)
{
	let character_code = 0;
	let remainder = 0;
	
	character_code = data >>> 16;
	remainder = character_code % 26;
	character_code = remainder << 16;
	
	character_code = character_code | (data & 0x0000ffff);
	character_code = character_code % 26;
	
	return character_code;
}

function ecco2_raw_generate_password(
	stage_id,
	globe_pairs,
        difficulty,
	difficulty_points,
        time_elapsed)
{
	let password_char_code = [0,0,0,0,0,0,0,0];
	let password = "";
	
	let index = 0;
	let char_code_sum = 0;
	let data = 0;
	let hword = 0, lword = 0, remainder = 0;

        let pr = ecco2_create_password_record();

        pr.stage_id = stage_id;
        pr.time_elapsed = time_elapsed;
        pr.globe_pairs = globe_pairs;

        pr.difficulty_points = difficulty_points;
        pr.forced_easy_mode = difficulty & 0x1;
        pr.forced_hard_mode = (difficulty >>> 1) & 0x1;
        pr.cheat_mode_enabled = pr.forced_easy_mode & pr.forced_hard_mode;

	data = ecco2_pack_data(pr);
	
	// UPDATE!!!
	data = ecco2_32bit_encrypt(data);
	
	while (index < 8)
	{
		password_char_code[index] = ecco2_extract_character_code(data);
		char_code_sum+= password_char_code[index];
	// fix!!!!!	
		hword = data >>> 16;
		remainder = hword % 26;
		hword = Math.trunc(hword/26);
		
		lword = data & 0x0000ffff;
		lword = (remainder << 16) | lword;
		lword = Math.trunc(lword/26);
	
                // this is just division by 26, also needs JS fix, remove bottom too.
	
		data  = (hword << 16) | lword;
		
		index++;
		if (index == 3)
		    index++;
	}
	
	index = (char_code_sum & 0x0000ffff) % 26;
	password_char_code[3] = password_keys[index];
        
/*	
	for (index = 0; index < 8; index++)
		password[index] = character_table[
			password_char_code[index]];
*/

	for (index = 0; index < 8; index++)
            password+= character_table[password_char_code[index]];

        pr.password = password;
	
	return pr;
}

function ecco2_generate_password(
	stage_id,
	globe_pairs,
	difficulty,
	difficulty_points,
        time_elapsed)
{
    let globe_audit = 0;
	
    globe_audit =  ecco2_get_globe_audit(stage_id);
	
    return ecco2_raw_generate_password(
        stage_id & ECCO2_STAGE_ID_MASK,
        globe_audit,
        difficulty,
        difficulty_points,
        time_elapsed);
}

function ecco2_decrypt_raw_password(password)
{
        let password_record = ecco2_create_password_record();;
	let password_char = -1;
	let password_char_code = [0,0,0,0,0,0,0,0];
	let password_sum = 0;
	
	let index = 0;
	let key = 0;
	
	let remainder = 0;
	let product = 0;
	let x = 0, y = 0;
	
	let encrypted_data = 0;
	let data = 0;
	
	password = password.toUpperCase();
	password_char = password.split("");

        password_record.password = password;

	if (password_char.length != 8)
	{
		password_record.error_id = ECCO_INVALIDPASS_CHARLEN;
		return password_record;
	}
	
	for (index = 0; index < 8; index++)
	{
		password_char_code[index] = get_character_code(password_char[index]);
		if (password_char_code[index] == -1)
		{
			password_record.error_id = ECCO_INVALIDPASS_ALPHAONLY;
			return password_record;
		}
	}
	
	for (index = 0; index < password_char.length; index++)
		password_char_code[index] = get_character_code(password_char[index]);
	
	for (index = 0; index <= 7; index++)
	{
	    if (index == 3)
	        index++;
			
	    password_sum+= password_char_code[index];
	}
	
	remainder = password_sum % 26;
	
	index = password_char_code[3];
	key = password_decryption_keys[index];
	
	password_record.checksum = character_table[password_keys[remainder]];

        // DEBUG RETURN
	if (remainder != key)
	    password_record.error_id = -ECCO_INVALIDPASS_CHECKSUM;
	
	x = 1;
	for (index = 0; index <= 7; index++)
	{
		if (index == 3)
			index++;
		
		product = x * password_char_code[index];
		encrypted_data+= product;
		
		x+= x;
		y = x;
		x = x << 2;

		// JAVASCRIPT HACK
		x = x >>> 0;
	
		y+= x;
		x+= x;
		x+= y;
	}
	
	data = ecco2_32bit_decrypt(encrypted_data);
        ecco2_unpack_data(data, password_record);

        password_record.password = password;
        password_record.unencrypted_data = data;

	return password_record;
}

function ecco2_decrypt_password(password)
{
    return ecco2_decrypt_raw_password(password);
}


