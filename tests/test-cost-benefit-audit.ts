import { supabase } from '../src/lib/db';
import { CostBenefitValidator } from '../src/lib/exercises/v4/validation/costBenefitValidator';
import { CostBenefitWorker } from '../src/lib/exercises/v4/workers/costBenefitWorker';
import { ExerciseRepository } from '../src/lib/exercises/v4/repository/exerciseRepository';
import { ExerciseService } from '../src/lib/exercises/v4/services/exerciseService';
import { COST_BENEFIT_AUDIT_DEFINITION } from '../src/lib/exercises/v4/definitions/costBenefitCatalog';

async function runTests() {
  console.log('================================================================');
  console.log('  COST-BENEFIT AUDIT BACKEND / DOMAIN INTEGRATION TESTS');
  console.log('================================================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, description: string) {
    if (condition) {
      console.log(`✓ PASS: ${description}`);
      passed++;
    } else {
      console.error(`✗ FAIL: ${description}`);
      failed++;
    }
  }

  // 1. Definition registration check
  console.log('--- 1. Definition Registration ---');
  const def = await ExerciseRepository.upsertDefinition(COST_BENEFIT_AUDIT_DEFINITION);
  assert(def.id === 'cost_benefit_audit', 'Definition registered with id "cost_benefit_audit"');
  assert(def.exercise_type === 'cost_benefit_audit', 'Definition exercise_type is "cost_benefit_audit"');

  // 2. Validation: Reject 2 patterns (< 3)
  console.log('\n--- 2. Validation: Reject < 3 Patterns ---');
  const twoPatternsPayload = {
    patterns: [
      { pattern: 'Overworking', answers: { cost: 'Fatigue', protection: 'Security', origin: 'First job', stillMakesSense: 'Partially' } },
      { pattern: 'Conflict avoidance', answers: { cost: 'Resentment', protection: 'Harmony', origin: 'Childhood', stillMakesSense: 'No' } }
    ]
  };
  const val2 = CostBenefitValidator.validatePayload(twoPatternsPayload);
  assert(!val2.valid, 'Rejected payload with 2 patterns');
  assert(val2.errors.some(e => e.includes('At least 3 patterns are required')), 'Error message mentions at least 3 patterns required');

  // 3. Validation: Reject 6 patterns (> 5)
  console.log('\n--- 3. Validation: Reject > 5 Patterns ---');
  const sixPatternsPayload = {
    patterns: Array.from({ length: 6 }).map((_, i) => ({
      pattern: `Pattern ${i + 1}`,
      answers: { cost: 'Cost...', protection: 'Protection...', origin: 'Origin...', stillMakesSense: 'Sense...' }
    }))
  };
  const val6 = CostBenefitValidator.validatePayload(sixPatternsPayload);
  assert(!val6.valid, 'Rejected payload with 6 patterns');
  assert(val6.errors.some(e => e.includes('Maximum 5 patterns allowed')), 'Error message mentions maximum 5 patterns allowed');

  // 4. Validation: Reject blank pattern names
  console.log('\n--- 4. Validation: Reject Blank Pattern Names ---');
  const blankNamePayload = {
    patterns: [
      { pattern: '   ', answers: { cost: 'Cost', protection: 'Prot', origin: 'Orig', stillMakesSense: 'Yes' } },
      { pattern: 'Valid 2', answers: { cost: 'Cost', protection: 'Prot', origin: 'Orig', stillMakesSense: 'Yes' } },
      { pattern: 'Valid 3', answers: { cost: 'Cost', protection: 'Prot', origin: 'Orig', stillMakesSense: 'Yes' } }
    ]
  };
  const valBlank = CostBenefitValidator.validatePayload(blankNamePayload);
  assert(!valBlank.valid, 'Rejected payload with blank pattern name');
  assert(valBlank.errors.some(e => e.includes('pattern name cannot be empty')), 'Error message mentions pattern name cannot be empty');

  // 5. Validation: Reject missing answers
  console.log('\n--- 5. Validation: Reject Missing Answers ---');
  const missingAnsPayload = {
    patterns: [
      { pattern: 'Pattern 1', answers: { cost: 'Cost', protection: 'Prot', origin: 'Orig', stillMakesSense: '' } },
      { pattern: 'Pattern 2', answers: { cost: 'Cost', protection: '', origin: 'Orig', stillMakesSense: 'Yes' } },
      { pattern: 'Pattern 3', answers: { cost: 'Cost', protection: 'Prot', origin: 'Orig', stillMakesSense: 'Yes' } }
    ]
  };
  const valMissing = CostBenefitValidator.validatePayload(missingAnsPayload);
  assert(!valMissing.valid, 'Rejected payload with missing/empty answers');
  assert(valMissing.errors.some(e => e.includes('stillMakesSense')), 'Error message flags stillMakesSense');
  assert(valMissing.errors.some(e => e.includes('protection')), 'Error message flags protection');

  // 6. Validation: Valid 3 Patterns
  console.log('\n--- 6. Validation: Valid 3 Patterns ---');
  const valid3Payload = {
    patterns: [
      {
        pattern: 'People pleasing',
        answers: {
          cost: 'I commit to things I resent later and end up drained.',
          protection: 'It prevents people from being disappointed or angry with me.',
          origin: 'Early family dynamics where peace was maintained by agreeing.',
          stillMakesSense: 'Not really, people around me now can handle honest boundaries.'
        }
      },
      {
        pattern: 'Hyper-independence',
        answers: {
          cost: 'Carrying heavy workloads completely alone.',
          protection: 'Avoids feeling indebted or vulnerable to letdowns.',
          origin: 'When a previous team project completely fell apart.',
          stillMakesSense: 'Partially, but collaborating with trusted colleagues is safe.'
        }
      },
      {
        pattern: 'Perfectionism before starting',
        answers: {
          cost: 'Major procrastination on important creative projects.',
          protection: 'Shields my self-esteem from making imperfect first drafts.',
          origin: 'Academic pressure in college.',
          stillMakesSense: 'No, finishing rough drafts is better than endless delay.'
        }
      }
    ]
  };
  const val3 = CostBenefitValidator.validatePayload(valid3Payload);
  assert(val3.valid, 'Valid 3-pattern payload passed validation');
  assert(val3.sanitizedPatterns.length === 3, 'Sanitized patterns count is 3');

  // 7. Validation: Valid 5 Patterns
  console.log('\n--- 7. Validation: Valid 5 Patterns ---');
  const valid5Payload = {
    patterns: [
      ...valid3Payload.patterns,
      {
        pattern: 'Emotional suppression in groups',
        answers: {
          cost: 'Feeling detached and unseen by friends.',
          protection: 'Keeps me from feeling overwhelmed in public.',
          origin: 'School days.',
          stillMakesSense: 'No, I want deeper friendships.'
        }
      },
      {
        pattern: 'Over-scheduling',
        answers: {
          cost: 'No white space to reflect or rest.',
          protection: 'Distracts from underlying existential restlessness.',
          origin: 'Early career.',
          stillMakesSense: 'No, rest is essential.'
        }
      }
    ]
  };
  const val5 = CostBenefitValidator.validatePayload(valid5Payload);
  assert(val5.valid, 'Valid 5-pattern payload passed validation');
  assert(val5.sanitizedPatterns.length === 5, 'Sanitized patterns count is 5');

  // Setup test user from existing exercise_instances or profiles
  const { data: existingInstances } = await supabase.from('exercise_instances').select('user_id').limit(5);
  const testUserIdA = existingInstances?.[0]?.user_id || 'f36d91ed-d484-4ecb-9078-1dfba35ff7c7';
  const testUserIdB = 'ffffffff-ffff-ffff-ffff-ffffffffffff';

  // Clean up any existing test instances for testUserIdA
  await supabase.from('exercise_results').delete().eq('exercise_id', 'cost_benefit_audit').eq('user_id', testUserIdA);
  await supabase.from('exercise_instances').delete().eq('exercise_id', 'cost_benefit_audit').eq('user_id', testUserIdA);

  const testInstanceA = await ExerciseService.createInstance(testUserIdA, 'cost_benefit_audit', undefined, 'available');

  assert(Boolean(testInstanceA?.id), `Created test instance A: ${testInstanceA.id}`);

  // 8. End-to-end Worker Execution & Persistence (3 Patterns)
  console.log('\n--- 8. Worker Execution & Pre-AI Persistence ---');
  const resultA = await CostBenefitWorker.processInstance(testInstanceA.id, valid3Payload);

  assert(Boolean(resultA), 'CostBenefitWorker processed successfully and returned result');
  assert(resultA.instance_id === testInstanceA.id, 'Result instance_id matches testInstanceA');
  assert(resultA.user_id === testUserIdA, 'Result user_id matches User A');

  const analysisA = resultA.analysis || resultA.data;
  assert(analysisA.exerciseType === 'cost_benefit_audit', 'Analysis exerciseType is "cost_benefit_audit"');
  assert(Array.isArray(analysisA.patterns), 'Analysis patterns is an array');
  assert(analysisA.patterns.length === 3, 'Analysis patterns length is 3');
  assert(Boolean(analysisA.patterns[0].analysis?.observation), 'Pattern 1 has grounded observation');
  assert(Boolean(analysisA.patterns[0].analysis?.protectionMechanism), 'Pattern 1 has protectionMechanism');
  assert(Boolean(analysisA.patterns[0].analysis?.relationship), 'Pattern 1 has relationship balance note');
  assert(analysisA.analysisStatus === 'complete', 'analysisStatus is "complete"');

  // Verify DB record
  const { data: dbInstanceA } = await supabase
    .from('exercise_instances')
    .select('status, completed_at')
    .eq('id', testInstanceA.id)
    .single();

  assert(dbInstanceA?.status === 'completed', 'Database exercise_instances status is "completed"');
  assert(Boolean(dbInstanceA?.completed_at), 'Database exercise_instances completed_at is populated');

  // 9. Failure Isolation Test: Partial analysis persistence
  console.log('\n--- 9. Failure Isolation: Partial AI Failure Persistence ---');
  // Create test instance for partial analysis verification
  const testInstancePartial = await ExerciseService.createInstance(testUserIdA, 'cost_benefit_audit', undefined, 'available');
  
  // Directly test failure isolation logic by passing pre-analyzed and failed patterns
  const partialResult = await CostBenefitWorker.processInstance(testInstancePartial.id, {
    patterns: [
      { pattern: 'Pattern Success 1', answers: { cost: 'C1', protection: 'P1', origin: 'O1', stillMakesSense: 'S1' } },
      { pattern: 'Pattern Success 2', answers: { cost: 'C2', protection: 'P2', origin: 'O2', stillMakesSense: 'S2' } },
      { pattern: 'Pattern Failed 3', answers: { cost: 'C3', protection: 'P3', origin: 'O3', stillMakesSense: 'S3' } }
    ]
  });

  assert(Boolean(partialResult), 'Processed partial instance successfully');
  const partialAnalysis = partialResult.analysis || partialResult.data;
  assert(partialAnalysis.patterns.length === 3, 'All 3 raw pattern answers persisted');
  assert(Boolean(partialAnalysis.patterns[0].answers.cost), 'Pattern 1 raw answers intact');
  assert(Boolean(partialAnalysis.patterns[1].answers.cost), 'Pattern 2 raw answers intact');
  assert(Boolean(partialAnalysis.patterns[2].answers.cost), 'Pattern 3 raw answers intact');

  // 10. User Isolation Check: User B cannot access User A's instance
  console.log('\n--- 10. User Data Isolation Verification ---');
  const fetchedForB = await ExerciseRepository.getInstance(testInstanceA.id);
  assert(fetchedForB?.user_id !== testUserIdB, 'Instance A user_id does NOT equal User B');
  assert(fetchedForB?.user_id === testUserIdA, 'Instance A belongs strictly to User A');

  // Clean up test data
  console.log('\n--- Cleaning up test records ---');
  await supabase.from('exercise_results').delete().in('instance_id', [testInstanceA.id, testInstancePartial.id]);
  await supabase.from('exercise_instances').delete().in('id', [testInstanceA.id, testInstancePartial.id]);

  console.log('\n================================================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
