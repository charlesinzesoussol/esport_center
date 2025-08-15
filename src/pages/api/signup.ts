import type { APIRoute } from 'astro';
import fs from 'fs/promises';
import path from 'path';

// Email validation function
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// File path for storing emails
const EMAILS_FILE = path.join(process.cwd(), 'data', 'emails.json');

// Ensure data directory exists
async function ensureDataDirectory() {
  const dataDir = path.dirname(EMAILS_FILE);
  try {
    await fs.mkdir(dataDir, { recursive: true });
  } catch (error) {
    // Directory might already exist, ignore error
  }
}

// Read existing emails
async function readEmails(): Promise<any[]> {
  try {
    const data = await fs.readFile(EMAILS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // File doesn't exist yet, return empty array
    return [];
  }
}

// Write emails to file
async function writeEmails(emails: any[]): Promise<void> {
  await fs.writeFile(EMAILS_FILE, JSON.stringify(emails, null, 2));
}

export const POST: APIRoute = async ({ request }) => {
  try {
    // Parse request body
    const body = await request.json();
    const { email } = body;

    // Validate email
    if (!email || typeof email !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    if (!isValidEmail(email)) {
      return new Response(
        JSON.stringify({ error: 'Please enter a valid email address' }),
        { 
          status: 400, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Ensure data directory exists
    await ensureDataDirectory();

    // Read existing emails
    const emails = await readEmails();

    // Check if email already exists
    const existingEmail = emails.find((entry) => entry.email.toLowerCase() === email.toLowerCase());
    if (existingEmail) {
      return new Response(
        JSON.stringify({ error: 'Email already registered' }),
        { 
          status: 409, 
          headers: { 'Content-Type': 'application/json' } 
        }
      );
    }

    // Add new email entry
    const newEntry = {
      email: email.toLowerCase(),
      timestamp: new Date().toISOString(),
      userAgent: request.headers.get('user-agent') || 'unknown',
      ip: request.headers.get('x-forwarded-for') || 
          request.headers.get('x-real-ip') || 
          'unknown'
    };

    emails.push(newEntry);

    // Write back to file
    await writeEmails(emails);

    // Return success response
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email successfully registered',
        count: emails.length 
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in signup API:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};

export const GET: APIRoute = async () => {
  try {
    // Ensure data directory exists
    await ensureDataDirectory();

    // Read existing emails
    const emails = await readEmails();

    // Return count and basic stats (without exposing actual emails)
    return new Response(
      JSON.stringify({ 
        count: emails.length,
        latestSignup: emails.length > 0 ? emails[emails.length - 1].timestamp : null
      }),
      { 
        status: 200, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in signup API GET:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { 'Content-Type': 'application/json' } 
      }
    );
  }
};