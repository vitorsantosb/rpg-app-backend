import {ICampaign} from '@models/campaign.model';

export const CampaignAdapter = {
  campaignResponse: (campaign: ICampaign) => {
    return {
      _id: campaign._id,
      _name: campaign._name,
      _description: campaign._description,
      _master_id: campaign._master_id,
      _players: campaign._players || [],
      _maxPlayers: campaign._maxPlayers,
      _status: campaign._status,
      _created_at: campaign._created_at,
    }
  }
}

