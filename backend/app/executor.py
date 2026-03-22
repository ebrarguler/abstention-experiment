import subprocess
import sys
import json
import tempfile
import os
from typing import Any


def run_tests(participant_code: str, visible_tests: list) -> list:
    """
    Run participant code against test cases.
    visible_tests is a list of dicts: {name, function_name, input_args (list), expected_output, setup_code (optional)}
    Returns list of {name, passed, expected, actual, error}
    """
    results = []

    for test in visible_tests:
        test_script = f"""
import json
import sys

{participant_code}

try:
    args = {repr(test['input_args'])}
    result = {test['function_name']}(*args)
    print(json.dumps({{"result": result, "error": None}}))
except Exception as e:
    print(json.dumps({{"result": None, "error": str(e)}}))
"""
        try:
            proc = subprocess.run(
                [sys.executable, '-c', test_script],
                capture_output=True,
                text=True,
                timeout=5
            )
            output = proc.stdout.strip()
            if output:
                data = json.loads(output)
                actual = data.get('result')
                error = data.get('error')
                passed = error is None and actual == test['expected_output']
            else:
                actual = None
                error = proc.stderr.strip() or "No output"
                passed = False
        except subprocess.TimeoutExpired:
            actual = None
            error = "Execution timed out"
            passed = False
        except Exception as e:
            actual = None
            error = str(e)
            passed = False

        results.append({
            'name': test['name'],
            'passed': passed,
            'expected': repr(test['expected_output']),
            'actual': repr(actual) if actual is not None else str(actual),
            'error': error
        })

    return results
