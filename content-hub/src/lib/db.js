import insforge from './insforge';

// ---------- Campaigns ----------

export async function getCampaigns() {
  const { data, error } = await insforge.database
    .from('campaigns')
    .select('*');
  if (error) throw error;
  return (data || []).map(normalizeCampaign);
}

export async function getCampaign(id) {
  const { data, error } = await insforge.database
    .from('campaigns')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return normalizeCampaign(data);
}

export async function saveCampaign(campaign) {
  const row = campaignToRow(campaign);
  if (campaign.id) {
    const { error } = await insforge.database
      .from('campaigns')
      .update(row)
      .eq('id', campaign.id);
    if (error) throw error;
  } else {
    const { error } = await insforge.database
      .from('campaigns')
      .insert([row]);
    if (error) throw error;
  }
}

export async function deleteCampaign(id) {
  const { error } = await insforge.database
    .from('campaigns')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

function normalizeCampaign(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    prompts: row.prompts || [],
    welcomeMessage: row.welcome_message,
    thankYouMessage: row.thank_you_message,
    brandColor: row.brand_color,
    allowVideo: row.allow_video,
    allowText: row.allow_text,
    maxDuration: row.max_duration,
    collectName: row.collect_name,
    collectEmail: row.collect_email,
    collectCompany: row.collect_company,
    collectRating: row.collect_rating,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function campaignToRow(c) {
  const row = {};
  if (c.title !== undefined) row.title = c.title;
  if (c.description !== undefined) row.description = c.description;
  if (c.prompts !== undefined) row.prompts = c.prompts;
  if (c.welcomeMessage !== undefined) row.welcome_message = c.welcomeMessage;
  if (c.thankYouMessage !== undefined) row.thank_you_message = c.thankYouMessage;
  if (c.brandColor !== undefined) row.brand_color = c.brandColor;
  if (c.allowVideo !== undefined) row.allow_video = c.allowVideo;
  if (c.allowText !== undefined) row.allow_text = c.allowText;
  if (c.maxDuration !== undefined) row.max_duration = c.maxDuration;
  if (c.collectName !== undefined) row.collect_name = c.collectName;
  if (c.collectEmail !== undefined) row.collect_email = c.collectEmail;
  if (c.collectCompany !== undefined) row.collect_company = c.collectCompany;
  if (c.collectRating !== undefined) row.collect_rating = c.collectRating;
  return row;
}

// ---------- Testimonials ----------

export async function getTestimonials(campaignId) {
  let query = insforge.database.from('testimonials').select('*');
  if (campaignId) {
    query = query.eq('campaign_id', campaignId);
  }
  const { data, error } = await query;
  if (error) throw error;
  return (data || []).map(normalizeTestimonial);
}

export async function getTestimonial(id) {
  const { data, error } = await insforge.database
    .from('testimonials')
    .select('*')
    .eq('id', id)
    .single();
  if (error || !data) return null;
  return normalizeTestimonial(data);
}

export async function saveTestimonial(testimonial) {
  const row = testimonialToRow(testimonial);
  if (testimonial.id && !testimonial._isNew) {
    const { error } = await insforge.database
      .from('testimonials')
      .update(row)
      .eq('id', testimonial.id);
    if (error) throw error;
  } else {
    const { error } = await insforge.database
      .from('testimonials')
      .insert([row]);
    if (error) throw error;
  }
}

export async function deleteTestimonial(id) {
  const t = await getTestimonial(id);
  if (t?.videoKey) {
    await deleteVideo(t.videoKey);
  }
  const { error } = await insforge.database
    .from('testimonials')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

function normalizeTestimonial(row) {
  return {
    id: row.id,
    campaignId: row.campaign_id,
    type: row.type,
    text: row.text,
    name: row.name,
    email: row.email,
    company: row.company,
    rating: row.rating,
    status: row.status,
    videoUrl: row.video_url,
    videoKey: row.video_key,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function testimonialToRow(t) {
  const row = {};
  if (t.campaignId !== undefined) row.campaign_id = t.campaignId;
  if (t.type !== undefined) row.type = t.type;
  if (t.text !== undefined) row.text = t.text;
  if (t.name !== undefined) row.name = t.name;
  if (t.email !== undefined) row.email = t.email;
  if (t.company !== undefined) row.company = t.company;
  if (t.rating !== undefined) row.rating = t.rating;
  if (t.status !== undefined) row.status = t.status;
  if (t.videoUrl !== undefined) row.video_url = t.videoUrl;
  if (t.videoKey !== undefined) row.video_key = t.videoKey;
  return row;
}

// ---------- Video Storage ----------

export async function saveVideo(blob) {
  const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
  const filename = `testimonial-${Date.now()}.${ext}`;
  const file = new File([blob], filename, { type: blob.type });

  const { data, error } = await insforge.storage
    .from('testimonial-videos')
    .uploadAuto(file);

  if (error) throw error;
  return { url: data.url, key: data.key };
}

export async function getVideo(key) {
  const { data, error } = await insforge.storage
    .from('testimonial-videos')
    .download(key);
  if (error) return null;
  return data;
}

export async function deleteVideo(key) {
  if (!key) return;
  await insforge.storage
    .from('testimonial-videos')
    .remove(key);
}
