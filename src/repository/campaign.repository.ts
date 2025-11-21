import {ICampaign} from '@models/campaign.model';
import {GetDatabase} from '@database/database';
import {ObjectId} from 'mongodb';

class CampaignRepository {
  async Store(campaign: ICampaign) {
    const { collections} = await GetDatabase();

    return collections.campaigns.insertOne(JSON.parse(JSON.stringify(campaign)));
  }

  async GetCampaignByOwnerId(_id: ObjectId) {
    const {collections} = await GetDatabase();

    return await collections.campaigns.find({
      _master_id: _id,
    }).toArray();
  }
}

export default new CampaignRepository();
