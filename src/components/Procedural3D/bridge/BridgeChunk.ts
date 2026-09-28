import type * as THREE from 'three';
import { CHUNK } from '../config';
import type { InstancePool } from '../world/InstancePool';
import { PARTS, type Parts, type PartPlacement } from '../types';
import { mulberry32 } from '../utils';
import { placeCables } from './parts/cables';
import { placeDeck } from './parts/deck';
import { placeSuspenders } from './parts/suspenders';
import { placeTower } from './parts/tower';


