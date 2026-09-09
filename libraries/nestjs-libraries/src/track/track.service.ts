import { TrackEnum } from '@hookpost/nestjs-libraries/user/track.enum';
import { User } from '@prisma/client';
import { Injectable } from '@nestjs/common';
import {
  ServerEvent,
  EventRequest,
  UserData,
  CustomData,
  FacebookAdsApi,
} from 'facebook-nodejs-business-sdk';
import { createHash } from 'crypto';

const access_token = process.env.FACEBOOK_PIXEL_ACCESS_TOKEN!;
const pixel_id = process.env.NEXT_PUBLIC_FACEBOOK_PIXEL!;

if (access_token && pixel_id) {
  FacebookAdsApi.init(access_token || '');
}

@Injectable()
export class TrackService {
  private hashValue(value: string) {
    return createHash('sha256').update(value).digest('hex');
  }
  track(
    uniqueId: string,
    ip: string,
    agent: string,
    tt: TrackEnum,
    additional: Record<string, any>,
    fbclid?: string,
    user?: User
  ) {
    if (!access_token || !pixel_id) {
      return;
    }
    // @ts-ignore
    const current_timestamp = Math.floor(new Date() / 1000);

    const userData = new UserData();
    if (ip || user?.ip) {
      userData.setClientIpAddress(ip || user?.ip || '');
    }

    if (agent || user?.agent) {
      userData.setClientUserAgent(agent || user?.agent || '');
    }
    if (fbclid) {
      userData.setFbc(fbclid);
    }

    if (user && user.email) {
      userData.setEmail(this.hashValue(user.email));
    }

    let customData = null;
    if (additional?.value) {
      customData = new CustomData();
      // Was hardcoded to USD. Billing is Razorpay in INR, so every purchase
      // value was being reported in the wrong currency - a Rs 699 charge read
      // as $699 to Meta, which would wreck any ROAS-based bidding.
      customData
        .setValue(additional.value)
        .setCurrency(additional.currency || 'INR');
    }

    const serverEvent = new ServerEvent()
      .setEventName(TrackEnum[tt])
      .setEventTime(current_timestamp)
      .setActionSource('website');

    // Always set the event id. The browser fires fbq(..., {eventID: uq}) with
    // the same value, and Meta uses it to collapse the pair into one event.
    // This used to be inside `if (user)`, so every anonymous event - a landing
    // page view, a registration before the account exists - was counted twice:
    // once from the pixel and once from here. That inflates conversions and
    // corrupts the cost-per-acquisition figure the ad algorithm optimises on.
    if (uniqueId || user?.id) {
      serverEvent.setEventId(uniqueId || user!.id);
    }

    if (userData) {
      serverEvent.setUserData(userData);
    }
    if (customData) {
      serverEvent.setCustomData(customData);
    }

    const eventsData = [serverEvent];
    const eventRequest = new EventRequest(access_token, pixel_id).setEvents(
      eventsData
    );

    return eventRequest.execute();
  }
}
