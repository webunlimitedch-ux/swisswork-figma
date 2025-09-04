import { Hono } from 'npm:hono'
import { cors } from 'npm:hono/cors'
import { logger } from 'npm:hono/logger'
import { createClient } from 'npm:@supabase/supabase-js@2'
import * as kv from './kv_store.tsx'

const app = new Hono()

app.use('*', cors({
  origin: '*',
  allowHeaders: ['*'],
  allowMethods: ['*'],
}))

app.use('*', logger(console.log))

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
)

// Sign up route
app.post('/make-server-f4f78c5a/signup', async (c) => {
  try {
    const { email, password, name, accountType } = await c.req.json();
    
    if (!email || !password || !name || !accountType) {
      return c.json({ error: 'Missing required fields' }, 400);
    }

    if (!['individual', 'company'].includes(accountType)) {
      return c.json({ error: 'Invalid account type' }, 400);
    }

    // Create user with Supabase Auth
    const { data, error } = await supabase.auth.admin.createUser({
      email,
      password,
      user_metadata: { 
        name,
        accountType 
      },
      email_confirm: true
    });

    if (error) {
      console.log('Supabase auth error:', error);
      return c.json({ error: error.message }, 400);
    }

    const userId = data.user.id;

    // Create appropriate profile based on account type
    if (accountType === 'company') {
      // Create company profile
      await kv.set(`profile:${userId}`, {
        id: userId,
        userId,
        email,
        accountType: 'company',
        companyName: name,
        description: '',
        category: '',
        website: '',
        phone: '',
        location: '',
        rating: 0,
        completedJobs: 0,
        createdAt: new Date().toISOString()
      });
    } else {
      // Create individual profile
      await kv.set(`profile:${userId}`, {
        id: userId,
        userId,
        email,
        accountType: 'individual',
        name,
        createdAt: new Date().toISOString()
      });
    }

    return c.json({ 
      message: 'User created successfully',
      user: {
        id: userId,
        email,
        accountType,
        name
      }
    });

  } catch (error) {
    console.error('Error in signup:', error);
    return c.json({ error: 'Internal server error' }, 500);
  }
})

// Get user profile
app.get('/make-server-f4f78c5a/profile/:userId', async (c) => {
  try {
    const userId = c.req.param('userId')
    const profile = await kv.get(`profile:${userId}`)
    
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    return c.json(profile)
  } catch (error) {
    console.log('Get profile error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update user profile
app.put('/make-server-f4f78c5a/profile', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const updateData = await c.req.json()
    const existingProfile = await kv.get(`profile:${user.id}`)
    
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    const updatedProfile = { ...existingProfile, ...updateData, id: user.id }
    await kv.set(`profile:${user.id}`, updatedProfile)

    return c.json(updatedProfile)
  } catch (error) {
    console.log('Update profile error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Create service listing
app.post('/make-server-f4f78c5a/listings', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { title, description, category, budget, timeline } = await c.req.json()
    
    const listing = {
      id: crypto.randomUUID(),
      clientId: user.id,
      title,
      description,
      category,
      budget,
      timeline,
      status: 'open',
      offers: [],
      createdAt: new Date().toISOString()
    }

    await kv.set(`listing:${listing.id}`, listing)
    
    // Add to client's listings
    const clientListings = await kv.get(`client-listings:${user.id}`) || []
    clientListings.push(listing.id)
    await kv.set(`client-listings:${user.id}`, clientListings)

    return c.json(listing)
  } catch (error) {
    console.log('Create listing error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get all listings
app.get('/make-server-f4f78c5a/listings', async (c) => {
  try {
    const category = c.req.query('category')
    const allListings = await kv.getByPrefix('listing:')
    
    let filteredListings = allListings.filter(listing => listing.status === 'open')
    
    if (category && category !== 'all') {
      filteredListings = filteredListings.filter(listing => listing.category === category)
    }

    return c.json(filteredListings.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()))
  } catch (error) {
    console.log('Get listings error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get single listing
app.get('/make-server-f4f78c5a/listings/:id', async (c) => {
  try {
    const listingId = c.req.param('id')
    const listing = await kv.get(`listing:${listingId}`)
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404)
    }

    return c.json(listing)
  } catch (error) {
    console.log('Get listing error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Update listing
app.put('/make-server-f4f78c5a/listings/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const listingId = c.req.param('id')
    const { title, description, category, budget, timeline } = await c.req.json()
    
    const existingListing = await kv.get(`listing:${listingId}`)
    if (!existingListing) {
      return c.json({ error: 'Listing not found' }, 404)
    }

    // Check if user is the owner of the listing
    if (existingListing.clientId !== user.id) {
      return c.json({ error: 'You can only edit your own listings' }, 403)
    }

    // Update the listing while preserving offers and other data
    const updatedListing = {
      ...existingListing,
      title,
      description,
      category,
      budget,
      timeline,
      updatedAt: new Date().toISOString()
    }

    await kv.set(`listing:${listingId}`, updatedListing)

    return c.json(updatedListing)
  } catch (error) {
    console.log('Update listing error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Delete listing
app.delete('/make-server-f4f78c5a/listings/:id', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const listingId = c.req.param('id')
    const listing = await kv.get(`listing:${listingId}`)
    
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404)
    }

    // Check if user is the owner of the listing
    if (listing.clientId !== user.id) {
      return c.json({ error: 'You can only delete your own listings' }, 403)
    }

    // Delete the listing
    await kv.del(`listing:${listingId}`)
    
    // Remove from client's listings
    const clientListings = await kv.get(`client-listings:${user.id}`) || []
    const updatedListings = clientListings.filter(id => id !== listingId)
    await kv.set(`client-listings:${user.id}`, updatedListings)

    return c.json({ message: 'Listing deleted successfully' })
  } catch (error) {
    console.log('Delete listing error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Submit offer
app.post('/make-server-f4f78c5a/offers', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { listingId, proposal, price, timeline, examples } = await c.req.json()
    
    const listing = await kv.get(`listing:${listingId}`)
    if (!listing) {
      return c.json({ error: 'Listing not found' }, 404)
    }

    const profile = await kv.get(`profile:${user.id}`)
    if (!profile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    // Check if user is a company
    if (profile.accountType !== 'company') {
      return c.json({ error: 'Only companies can submit offers' }, 403)
    }

    const offer = {
      id: crypto.randomUUID(),
      companyId: user.id,
      companyName: profile.companyName,
      listingId,
      proposal,
      price,
      timeline,
      examples: examples || [],
      status: 'pending',
      createdAt: new Date().toISOString()
    }

    // Add offer to listing
    listing.offers.push(offer)
    await kv.set(`listing:${listingId}`, listing)

    return c.json(offer)
  } catch (error) {
    console.log('Submit offer error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Get companies by category (only company profiles)
app.get('/make-server-f4f78c5a/companies', async (c) => {
  try {
    const category = c.req.query('category')
    const allProfiles = await kv.getByPrefix('profile:')
    
    // Filter only company profiles
    let companies = allProfiles.filter(profile => profile.accountType === 'company')
    
    if (category && category !== 'all') {
      companies = companies.filter(company => company.category === category)
    }

    return c.json(companies.sort((a, b) => (b.rating || 0) - (a.rating || 0)))
  } catch (error) {
    console.log('Get companies error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

// Convert individual account to company account
app.post('/make-server-f4f78c5a/convert-to-company', async (c) => {
  try {
    const accessToken = c.req.header('Authorization')?.split(' ')[1]
    const { data: { user }, error } = await supabase.auth.getUser(accessToken)
    
    if (!user?.id) {
      return c.json({ error: 'Unauthorized' }, 401)
    }

    const { companyName } = await c.req.json()
    
    if (!companyName || companyName.trim().length === 0) {
      return c.json({ error: 'Company name is required' }, 400)
    }

    const existingProfile = await kv.get(`profile:${user.id}`)
    if (!existingProfile) {
      return c.json({ error: 'Profile not found' }, 404)
    }

    // Check if already a company
    if (existingProfile.accountType === 'company') {
      return c.json({ error: 'Account is already a company account' }, 400)
    }

    // Convert individual profile to company profile
    const companyProfile = {
      ...existingProfile,
      accountType: 'company',
      companyName: companyName.trim(),
      description: '',
      category: '',
      website: '',
      phone: '',
      location: '',
      rating: 0,
      completedJobs: 0,
      // Keep original creation date but add conversion date
      convertedAt: new Date().toISOString()
    }

    // Remove individual-specific fields
    delete companyProfile.name

    await kv.set(`profile:${user.id}`, companyProfile)

    return c.json(companyProfile)
  } catch (error) {
    console.log('Convert to company error:', error)
    return c.json({ error: 'Internal server error' }, 500)
  }
})

Deno.serve(app.fetch)