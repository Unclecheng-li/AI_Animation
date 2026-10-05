import string

def check_password_complexity(password):
    """
    Determines the complexity of a given password based on specific rules.
    """
    length = len(password)
    has_letters = any(char.isalpha() for char in password)
    has_numbers = any(char.isdigit() for char in password)
    has_special = any(char in string.punctuation or (not char.isalnum() and not char.isspace()) for char in password)
    
    # Check for Very Strong
    if length >= 8 and has_letters and has_numbers and has_special:
        return "Very Strong"
    
    # Check for Strong
    if length >= 8 and has_letters and has_numbers:
        return "Strong"
    
    # Check for Weak
    if length < 8 and password.isalpha():
        return "Weak"
    
    # Check for Very Weak
    if length < 8 and password.isdigit():
        return "Very Weak"
    
    return "Unknown/Other"

def main():
    print("Password Complexity Checker")
    print("-" * 30)
    
    # Test cases
    test_passwords = [
        "12345",        # Very Weak
        "abcdef",       # Weak
        "abc12345",     # Strong
        "abc12345!",    # Very Strong
        "12345678",     # Unknown (Length >= 8 but only numbers)
        "abc",          # Weak
    ]
    
    for pwd in test_passwords:
        complexity = check_password_complexity(pwd)
        print(f"Password: {pwd:15} | Complexity: {complexity}")

if __name__ == "__main__":
    main()
