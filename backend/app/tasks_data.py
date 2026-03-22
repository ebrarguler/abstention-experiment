TASKS = [
    # -------------------------------------------------------------------------
    # Task 1 — Set C — remove-duplicates
    # -------------------------------------------------------------------------
    {
        "slug": "remove-duplicates",
        "title": "Remove Duplicate Characters",
        "task_set": "C",
        "description": (
            "## Remove Duplicate Characters\n\n"
            "Given a string, return a new string with duplicate characters removed, "
            "preserving the **order of first occurrence**. Spaces are treated as characters.\n\n"
            "### Examples\n"
            "```\n"
            'remove_duplicates_preserve_order("programming") -> "programin"\n'
            'remove_duplicates_preserve_order("hello") -> "helo"\n'
            'remove_duplicates_preserve_order("abcabc") -> "abc"\n'
            "```\n"
        ),
        "function_signature": "def remove_duplicates_preserve_order(s: str) -> str:",
        "starter_code": (
            "def remove_duplicates_preserve_order(s: str) -> str:\n"
            "    # Your implementation here\n"
            "    pass\n"
        ),
        "correct_solution": (
            "def remove_duplicates_preserve_order(s: str) -> str:\n"
            "    seen = set()\n"
            "    result = []\n"
            "    for ch in s:\n"
            "        if ch not in seen:\n"
            "            seen.add(ch)\n"
            "            result.append(ch)\n"
            "    return ''.join(result)\n"
        ),
        "incorrect_solution": None,
        "abstention_message": (
            "I'm not confident enough to provide a code suggestion for this task. "
            "I'd recommend writing the solution yourself."
        ),
        "visible_tests": [
            {
                "name": "Normal string with duplicates",
                "function_name": "remove_duplicates_preserve_order",
                "input_args": ["programming"],
                "expected_output": "programin",
            },
            {
                "name": "String with spaces",
                "function_name": "remove_duplicates_preserve_order",
                "input_args": ["a b a b"],
                "expected_output": "a b",
            },
            {
                "name": "All unique characters",
                "function_name": "remove_duplicates_preserve_order",
                "input_args": ["abcdef"],
                "expected_output": "abcdef",
            },
            {
                "name": "Empty string",
                "function_name": "remove_duplicates_preserve_order",
                "input_args": [""],
                "expected_output": "",
            },
            {
                "name": "All same characters",
                "function_name": "remove_duplicates_preserve_order",
                "input_args": ["aaaa"],
                "expected_output": "a",
            },
        ],
        "hidden_tests": [
            {
                "name": "String with special characters",
                "function_name": "remove_duplicates_preserve_order",
                "input_args": ["a!b!c!"],
                "expected_output": "a!bc",
            },
            {
                "name": "Long string with many duplicates",
                "function_name": "remove_duplicates_preserve_order",
                "input_args": ["aabbccddeeffgghhiijj"],
                "expected_output": "abcdefghij",
            },
        ],
    },

    # -------------------------------------------------------------------------
    # Task 2 — Set C — chunk-list
    # -------------------------------------------------------------------------
    {
        "slug": "chunk-list",
        "title": "Chunk List",
        "task_set": "C",
        "description": (
            "## Chunk List\n\n"
            "Split a list into chunks of exactly **n** elements. "
            "The last chunk may contain fewer elements if the list cannot be divided evenly.\n\n"
            "### Examples\n"
            "```\n"
            "chunk_list([1,2,3,4,5], 2) -> [[1,2],[3,4],[5]]\n"
            "chunk_list([1,2,3,4], 3)   -> [[1,2,3],[4]]\n"
            "chunk_list([], 2)           -> []\n"
            "```\n"
        ),
        "function_signature": "def chunk_list(lst: list, n: int) -> list:",
        "starter_code": (
            "def chunk_list(lst: list, n: int) -> list:\n"
            "    # Your implementation here\n"
            "    pass\n"
        ),
        "correct_solution": (
            "def chunk_list(lst: list, n: int) -> list:\n"
            "    return [lst[i:i+n] for i in range(0, len(lst), n)]\n"
        ),
        "incorrect_solution": None,
        "abstention_message": (
            "I'm not confident enough to provide a code suggestion for this task. "
            "I'd recommend writing the solution yourself."
        ),
        "visible_tests": [
            {
                "name": "Normal case uneven split",
                "function_name": "chunk_list",
                "input_args": [[1, 2, 3, 4, 5], 2],
                "expected_output": [[1, 2], [3, 4], [5]],
            },
            {
                "name": "Even division",
                "function_name": "chunk_list",
                "input_args": [[1, 2, 3, 4, 6, 7], 2],
                "expected_output": [[1, 2], [3, 4], [6, 7]],
            },
            {
                "name": "Single element chunks",
                "function_name": "chunk_list",
                "input_args": [[1, 2, 3], 1],
                "expected_output": [[1], [2], [3]],
            },
            {
                "name": "Empty list",
                "function_name": "chunk_list",
                "input_args": [[], 2],
                "expected_output": [],
            },
            {
                "name": "n larger than list",
                "function_name": "chunk_list",
                "input_args": [[1, 2, 3], 10],
                "expected_output": [[1, 2, 3]],
            },
        ],
        "hidden_tests": [
            {
                "name": "Large n equal to list length",
                "function_name": "chunk_list",
                "input_args": [[1, 2, 3, 4, 5], 5],
                "expected_output": [[1, 2, 3, 4, 5]],
            },
            {
                "name": "n equals 1 for multiple elements",
                "function_name": "chunk_list",
                "input_args": [[10, 20, 30, 40], 1],
                "expected_output": [[10], [20], [30], [40]],
            },
        ],
    },

    # -------------------------------------------------------------------------
    # Task 3 — Set I — is-palindrome
    # -------------------------------------------------------------------------
    {
        "slug": "is-palindrome",
        "title": "Is Palindrome",
        "task_set": "I",
        "description": (
            "## Is Palindrome\n\n"
            "Check if a string is a palindrome. **Ignore case and all non-alphanumeric characters.**\n\n"
            "### Examples\n"
            "```\n"
            'is_palindrome("racecar")                      -> True\n'
            'is_palindrome("A man a plan a canal Panama")  -> True\n'
            'is_palindrome("hello")                        -> False\n'
            "```\n"
        ),
        "function_signature": "def is_palindrome(s: str) -> bool:",
        "starter_code": (
            "def is_palindrome(s: str) -> bool:\n"
            "    # Your implementation here\n"
            "    pass\n"
        ),
        "correct_solution": (
            "def is_palindrome(s: str) -> bool:\n"
            "    cleaned = ''.join(ch.lower() for ch in s if ch.isalnum())\n"
            "    return cleaned == cleaned[::-1]\n"
        ),
        # BUG: does not strip non-alphanumeric characters — only lowercases
        "incorrect_solution": (
            "def is_palindrome(s: str) -> bool:\n"
            "    cleaned = s.lower()\n"
            "    return cleaned == cleaned[::-1]\n"
        ),
        "abstention_message": (
            "I'm not confident enough to provide a code suggestion for this task. "
            "I'd recommend writing the solution yourself."
        ),
        "visible_tests": [
            {
                "name": "Simple palindrome",
                "function_name": "is_palindrome",
                "input_args": ["racecar"],
                "expected_output": True,
            },
            {
                "name": "Non-palindrome",
                "function_name": "is_palindrome",
                "input_args": ["hello"],
                "expected_output": False,
            },
            {
                "name": "Palindrome with spaces and mixed case",
                "function_name": "is_palindrome",
                "input_args": ["A man a plan a canal Panama"],
                "expected_output": True,
            },
            {
                "name": "Palindrome with punctuation",
                "function_name": "is_palindrome",
                "input_args": ["Was it a car or a cat I saw?"],
                "expected_output": True,
            },
            {
                "name": "Palindrome with spaces only",
                "function_name": "is_palindrome",
                "input_args": ["Never odd or even"],
                "expected_output": True,
            },
        ],
        "hidden_tests": [
            {
                "name": "Pure alphanumeric palindrome",
                "function_name": "is_palindrome",
                "input_args": ["AbcCbA"],
                "expected_output": True,
            },
            {
                "name": "Single character",
                "function_name": "is_palindrome",
                "input_args": ["a"],
                "expected_output": True,
            },
        ],
    },

    # -------------------------------------------------------------------------
    # Task 4 — Set I — rotate-list
    # -------------------------------------------------------------------------
    {
        "slug": "rotate-list",
        "title": "Rotate List",
        "task_set": "I",
        "description": (
            "## Rotate List\n\n"
            "Rotate the list to the **right** by k positions. "
            "If k is greater than the list length, wrap around.\n\n"
            "### Examples\n"
            "```\n"
            "rotate_list([1,2,3,4,5], 2) -> [4,5,1,2,3]\n"
            "rotate_list([1,2,3], 1)      -> [3,1,2]\n"
            "rotate_list([1,2,3], 4)      -> [3,1,2]\n"
            "```\n"
        ),
        "function_signature": "def rotate_list(lst: list, k: int) -> list:",
        "starter_code": (
            "def rotate_list(lst: list, k: int) -> list:\n"
            "    # Your implementation here\n"
            "    pass\n"
        ),
        "correct_solution": (
            "def rotate_list(lst: list, k: int) -> list:\n"
            "    if not lst:\n"
            "        return lst\n"
            "    k = k % len(lst)\n"
            "    if k == 0:\n"
            "        return lst\n"
            "    return lst[-k:] + lst[:-k]\n"
        ),
        # BUG: rotates LEFT instead of RIGHT (lst[k:] + lst[:k])
        "incorrect_solution": (
            "def rotate_list(lst: list, k: int) -> list:\n"
            "    if not lst:\n"
            "        return lst\n"
            "    k = k % len(lst)\n"
            "    return lst[k:] + lst[:k]\n"
        ),
        "abstention_message": (
            "I'm not confident enough to provide a code suggestion for this task. "
            "I'd recommend writing the solution yourself."
        ),
        "visible_tests": [
            {
                "name": "Right rotation by 2",
                "function_name": "rotate_list",
                "input_args": [[1, 2, 3, 4, 5], 2],
                "expected_output": [4, 5, 1, 2, 3],
            },
            {
                "name": "Right rotation by 1",
                "function_name": "rotate_list",
                "input_args": [[1, 2, 3], 1],
                "expected_output": [3, 1, 2],
            },
            {
                "name": "k greater than length",
                "function_name": "rotate_list",
                "input_args": [[1, 2, 3], 4],
                "expected_output": [3, 1, 2],
            },
            {
                "name": "Empty list",
                "function_name": "rotate_list",
                "input_args": [[], 2],
                "expected_output": [],
            },
            {
                "name": "Single element list",
                "function_name": "rotate_list",
                "input_args": [[5], 3],
                "expected_output": [5],
            },
        ],
        "hidden_tests": [
            {
                "name": "k equals list length (full rotation)",
                "function_name": "rotate_list",
                "input_args": [[1, 2, 3, 4], 4],
                "expected_output": [1, 2, 3, 4],
            },
            {
                "name": "Right rotation by 3",
                "function_name": "rotate_list",
                "input_args": [[1, 2, 3, 4, 5, 6], 3],
                "expected_output": [4, 5, 6, 1, 2, 3],
            },
        ],
    },

    # -------------------------------------------------------------------------
    # Task 5 — Set A — flatten-nested
    # -------------------------------------------------------------------------
    {
        "slug": "flatten-nested",
        "title": "Flatten Nested List",
        "task_set": "A",
        "description": (
            "## Flatten Nested List\n\n"
            "Flatten a list that may contain nested lists to **any depth** into a single flat list.\n\n"
            "### Examples\n"
            "```\n"
            "flatten_nested([1,[2,3],[4,[5,6]]]) -> [1,2,3,4,5,6]\n"
            "flatten_nested([[1,2],[3,[4,5]]])    -> [1,2,3,4,5]\n"
            "flatten_nested([1,2,3])              -> [1,2,3]\n"
            "```\n"
        ),
        "function_signature": "def flatten_nested(lst: list) -> list:",
        "starter_code": (
            "def flatten_nested(lst: list) -> list:\n"
            "    # Your implementation here\n"
            "    pass\n"
        ),
        "correct_solution": (
            "def flatten_nested(lst: list) -> list:\n"
            "    result = []\n"
            "    for item in lst:\n"
            "        if isinstance(item, list):\n"
            "            result.extend(flatten_nested(item))\n"
            "        else:\n"
            "            result.append(item)\n"
            "    return result\n"
        ),
        "incorrect_solution": None,
        "abstention_message": (
            "I'm not confident enough to provide a code suggestion for this task. "
            "I'd recommend writing the solution yourself."
        ),
        "visible_tests": [
            {
                "name": "Already flat list",
                "function_name": "flatten_nested",
                "input_args": [[1, 2, 3]],
                "expected_output": [1, 2, 3],
            },
            {
                "name": "One level nested",
                "function_name": "flatten_nested",
                "input_args": [[[1, 2], [3, 4]]],
                "expected_output": [1, 2, 3, 4],
            },
            {
                "name": "Deeply nested",
                "function_name": "flatten_nested",
                "input_args": [[1, [2, 3], [4, [5, 6]]]],
                "expected_output": [1, 2, 3, 4, 5, 6],
            },
            {
                "name": "Empty list",
                "function_name": "flatten_nested",
                "input_args": [[]],
                "expected_output": [],
            },
            {
                "name": "Mixed types",
                "function_name": "flatten_nested",
                "input_args": [[1, "a", [2, "b", [3, "c"]]]],
                "expected_output": [1, "a", 2, "b", 3, "c"],
            },
        ],
        "hidden_tests": [
            {
                "name": "Very deep nesting",
                "function_name": "flatten_nested",
                "input_args": [[[[[1]], [[2]]], [[[3]]]]],
                "expected_output": [1, 2, 3],
            },
            {
                "name": "Mixed nested and flat",
                "function_name": "flatten_nested",
                "input_args": [[1, [2, [3, [4, [5]]]], 6]],
                "expected_output": [1, 2, 3, 4, 5, 6],
            },
        ],
    },

    # -------------------------------------------------------------------------
    # Task 6 — Set A — valid-parentheses
    # -------------------------------------------------------------------------
    {
        "slug": "valid-parentheses",
        "title": "Valid Parentheses",
        "task_set": "A",
        "description": (
            "## Valid Parentheses\n\n"
            "Given a string containing only `'('`, `')'`, `'{'`, `'}'`, `'['`, `']'`, "
            "determine if the input string is **valid**.\n\n"
            "A string is valid if every opening bracket has a corresponding closing bracket "
            "in the correct order.\n\n"
            "### Examples\n"
            "```\n"
            'valid_parentheses("()")      -> True\n'
            'valid_parentheses("()[]{}")  -> True\n'
            'valid_parentheses("(]")      -> False\n'
            'valid_parentheses("([)]")    -> False\n'
            'valid_parentheses("{[]}")    -> True\n'
            "```\n"
        ),
        "function_signature": "def valid_parentheses(s: str) -> bool:",
        "starter_code": (
            "def valid_parentheses(s: str) -> bool:\n"
            "    # Your implementation here\n"
            "    pass\n"
        ),
        "correct_solution": (
            "def valid_parentheses(s: str) -> bool:\n"
            "    stack = []\n"
            "    mapping = {')': '(', '}': '{', ']': '['}\n"
            "    for ch in s:\n"
            "        if ch in mapping:\n"
            "            top = stack.pop() if stack else '#'\n"
            "            if mapping[ch] != top:\n"
            "                return False\n"
            "        else:\n"
            "            stack.append(ch)\n"
            "    return not stack\n"
        ),
        "incorrect_solution": None,
        "abstention_message": (
            "I'm not confident enough to provide a code suggestion for this task. "
            "I'd recommend writing the solution yourself."
        ),
        "visible_tests": [
            {
                "name": "Simple valid parentheses",
                "function_name": "valid_parentheses",
                "input_args": ["()"],
                "expected_output": True,
            },
            {
                "name": "Multiple types valid",
                "function_name": "valid_parentheses",
                "input_args": ["()[]{}"],
                "expected_output": True,
            },
            {
                "name": "Simple invalid — mismatched",
                "function_name": "valid_parentheses",
                "input_args": ["(]"],
                "expected_output": False,
            },
            {
                "name": "Interleaved invalid",
                "function_name": "valid_parentheses",
                "input_args": ["([)]"],
                "expected_output": False,
            },
            {
                "name": "Nested valid",
                "function_name": "valid_parentheses",
                "input_args": ["{[]}"],
                "expected_output": True,
            },
        ],
        "hidden_tests": [
            {
                "name": "Empty string",
                "function_name": "valid_parentheses",
                "input_args": [""],
                "expected_output": True,
            },
            {
                "name": "Deeply nested valid",
                "function_name": "valid_parentheses",
                "input_args": ["{[({[]})]()}"],
                "expected_output": True,
            },
        ],
    },
]
