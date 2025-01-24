import { Interval } from "luxon";
import { Event } from "../components/types";

interface TaggedInterval {
  id: string;
  interval: Interval;
}

// To avoid duplicating data, it always lives in _intervalDump, and channelList stores a number
// that corresponds to the matching index.

export class ChannelAllocator {
  _intervalDump: TaggedInterval[];
  _channelList: number[][];
  _indexMap: Record<string, number>;

  constructor() {
    this._channelList = [];
    this._intervalDump = [];
    this._indexMap = {};
  }

  allocate(event: Event) {
    let id = event.id;
    let interval = Interval.fromDateTimes(event.start, event.end);

    let channelNum = this._channelList.findIndex((channel) => {
      return !channel.some((taggedIntervalIndex) => {
        let taggedInterval = this._intervalDump[taggedIntervalIndex];
        return taggedInterval.interval.overlaps(interval);
      });
    });

    let len = this._intervalDump.push({ id, interval });
    if (channelNum != -1) {
      this._channelList[channelNum].push(len - 1);
      this._indexMap[id] = channelNum;
    } else {
      this._channelList.push([len - 1]);
      this._indexMap[id] = this._channelList.length - 1;
    }
  }

  getIndex(event: Event) {
    return this._indexMap[event.id];
  }

  getOverlap(event: Event) {
    let eventInterval = Interval.fromDateTimes(event.start, event.end);
    let eventIndex = this.getIndex(event);

    if (eventInterval == undefined) {
      return 0;
    }

    let overlap = 1;
    for (
      let channelIndex = 0;
      channelIndex < this._channelList.length;
      channelIndex++
    ) {
      if (channelIndex == eventIndex) {
        continue;
      }

      this._channelList[channelIndex].some((taggedIntervalIndex) => {
        let taggedInterval = this._intervalDump[taggedIntervalIndex];
        let overlaps = taggedInterval.interval.overlaps(eventInterval);
        overlap += overlaps ? 1 : 0;
        return overlaps;
      });
    }

    return overlap;
  }
}
