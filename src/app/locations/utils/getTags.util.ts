import { TagStates } from '../location.type';

export const getTags = (tagStates: TagStates) => {
  const tags: ('EVENT_DESTINATION' | 'SHUTTLE_HUB')[] = [];
  if (tagStates.isEventDestination) tags.push('EVENT_DESTINATION');
  if (tagStates.isShuttleHub) tags.push('SHUTTLE_HUB');
  return tags;
};
