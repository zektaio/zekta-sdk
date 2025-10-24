/**
 * ZK Twitter Example - Post Anonymous Tweets
 */

import { generateIdentity } from '../src/identity';
import { createSession, postTweet, getMyActions } from '../src/zktwitter';

const API_URL = 'https://zekta.io';

async function main() {
  console.log('=== ZK Twitter Example ===\n');

  // Step 1: Generate ZK Identity
  console.log('Step 1: Generate ZK Identity');
  const identity = generateIdentity();
  console.log('✓ Identity generated');
  console.log(`  ⚠️  SAVE THIS SECRET: ${identity.secret}`);
  console.log();

  // Step 2: Get group members (in production, fetch from API)
  console.log('Step 2: Fetch Group Members');
  const groupMembers = [identity.commitment]; // Demo: just our commitment
  console.log(`✓ Found ${groupMembers.length} group members`);
  console.log();

  // Step 3: Create session
  console.log('Step 3: Create Anonymous Session');
  const session = await createSession(
    API_URL,
    identity.secret,
    groupMembers
  );
  console.log('✓ Session created');
  console.log(`  Expires: ${session.expiresAt}`);
  console.log();

  // Step 4: Post tweet
  console.log('Step 4: Post Anonymous Tweet');
  const tweetText = 'Hello from ZK Twitter! 🚀 This is posted anonymously using zero-knowledge proofs.';
  const result = await postTweet(
    API_URL,
    session.zkSession,
    tweetText
  );
  console.log('✓ Tweet posted!');
  console.log(`  Tweet URL: ${result.tweetUrl}`);
  console.log(`  Tweet ID: ${result.tweetId}`);
  console.log();

  // Step 5: View tweet history
  console.log('Step 5: View Tweet History');
  const actions = await getMyActions(API_URL, session.zkSession);
  console.log(`✓ You have posted ${actions.length} tweets`);
  actions.slice(0, 3).forEach((action, i) => {
    console.log(`  ${i + 1}. ${action.text.substring(0, 50)}...`);
    console.log(`     URL: ${action.tweetUrl}`);
  });

  console.log('\n=== Example Complete ===');
}

main().catch(console.error);
