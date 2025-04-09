/**
 * Customer Feedback Survey Form JavaScript
 * Handles form interactivity, conditional fields, and validation
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
  const form = document.getElementById('survey-form');
  
  // Handle conditional fields
  handleConditionalFields();
  
  // Set up form validation
  setupFormValidation();
  
  // Character counter for comments
  setupCharacterCounter();
  
  // Handle form submission
  setupFormSubmission();
  
  // Setup reset button confirmation
  setupResetConfirmation();
});

/**
* Sets up conditional fields that should appear/disappear based on selections
*/
function handleConditionalFields() {
  // Show "Other source" field when "Other" option is selected in dropdown
  const sourceDropdown = document.getElementById('source');
  const otherSourceContainer = document.getElementById('other-source-container');
  
  if (sourceDropdown && otherSourceContainer) {
      sourceDropdown.addEventListener('change', function() {
          otherSourceContainer.style.display = this.value === 'other' ? 'block' : 'none';
          
          // If hiding the field, clear its value
          if (this.value !== 'other') {
              document.getElementById('other-source').value = '';
          } else {
              // Focus the other field when it appears
              setTimeout(() => document.getElementById('other-source').focus(), 50);
          }
      });
  }
  
  // Show "Other features" field when "Other" checkbox is checked
  const otherFeaturesCheckbox = document.getElementById('features-other');
  const otherFeaturesContainer = document.getElementById('other-features-container');
  
  if (otherFeaturesCheckbox && otherFeaturesContainer) {
      otherFeaturesCheckbox.addEventListener('change', function() {
          otherFeaturesContainer.style.display = this.checked ? 'block' : 'none';
          
          // If hiding the field, clear its value
          if (!this.checked) {
              document.getElementById('other-features').value = '';
          } else {
              // Focus the other field when it appears
              setTimeout(() => document.getElementById('other-features').focus(), 50);
          }
      });
  }
  
  // Handle follow-up checkbox to enable/disable email field requirement
  const followUpCheckbox = document.getElementById('follow-up');
  const emailField = document.getElementById('email');
  
  if (followUpCheckbox && emailField) {
      followUpCheckbox.addEventListener('change', function() {
          if (this.checked) {
              emailField.setAttribute('required', 'required');
              emailField.setAttribute('aria-required', 'true');
              // Find the label for email and add required indicator if not present
              const emailLabel = document.querySelector('label[for="email"]');
              if (emailLabel && !emailLabel.querySelector('.required')) {
                  const requiredSpan = document.createElement('span');
                  requiredSpan.className = 'required';
                  requiredSpan.textContent = '*';
                  emailLabel.appendChild(requiredSpan);
              }
          } else if (!document.getElementById('newsletter').checked) {
              // Only remove required if newsletter is also not checked
              emailField.removeAttribute('required');
              emailField.removeAttribute('aria-required');
              // Remove required indicator
              const emailLabel = document.querySelector('label[for="email"]');
              const requiredSpan = emailLabel.querySelector('.required');
              if (requiredSpan) {
                  emailLabel.removeChild(requiredSpan);
              }
          }
      });
  }
  
  // Do the same for newsletter checkbox
  const newsletterCheckbox = document.getElementById('newsletter');
  
  if (newsletterCheckbox && emailField) {
      newsletterCheckbox.addEventListener('change', function() {
          if (this.checked) {
              emailField.setAttribute('required', 'required');
              emailField.setAttribute('aria-required', 'true');
              // Find the label for email and add required indicator if not present
              const emailLabel = document.querySelector('label[for="email"]');
              if (emailLabel && !emailLabel.querySelector('.required')) {
                  const requiredSpan = document.createElement('span');
                  requiredSpan.className = 'required';
                  requiredSpan.textContent = '*';
                  emailLabel.appendChild(requiredSpan);
              }
          } else if (!document.getElementById('follow-up').checked) {
              // Only remove required if follow-up is also not checked
              emailField.removeAttribute('required');
              emailField.removeAttribute('aria-required');
              // Remove required indicator
              const emailLabel = document.querySelector('label[for="email"]');
              const requiredSpan = emailLabel.querySelector('.required');
              if (requiredSpan) {
                  emailLabel.removeChild(requiredSpan);
              }
          }
      });
  }
}

/**
* Sets up a character counter for the comments field
*/
function setupCharacterCounter() {
  const commentsField = document.getElementById('comments');
  const maxLength = 500;
  
  if (commentsField) {
      // Create character counter element
      const counterElement = document.createElement('div');
      counterElement.className = 'character-counter';
      counterElement.innerHTML = `0/${maxLength} characters`;
      
      // Set maximum length attribute
      commentsField.setAttribute('maxlength', maxLength);
      
      // Insert counter after the form hint
      const formHint = commentsField.nextElementSibling;
      if (formHint && formHint.className === 'form-hint') {
          formHint.parentNode.insertBefore(counterElement, formHint.nextSibling);
      } else {
          commentsField.parentNode.insertBefore(counterElement, commentsField.nextSibling);
      }
      
      // Update counter on input
      commentsField.addEventListener('input', function() {
          const currentLength = this.value.length;
          counterElement.innerHTML = `${currentLength}/${maxLength} characters`;
          
          // Change color when approaching limit
          if (currentLength > maxLength * 0.8) {
              counterElement.style.color = '#dc3545';
          } else {
              counterElement.style.color = '';
          }
      });
  }
}

/**
* Sets up form validation
*/
function setupFormValidation() {
  const form = document.getElementById('survey-form');
  
  if (!form) return;
  
  // Add error messages for required fields
  const requiredFields = form.querySelectorAll('[required]');
  requiredFields.forEach(field => {
      // Create error message element
      const errorElement = document.createElement('div');
      errorElement.className = 'error-message';
      errorElement.id = `${field.id}-error`;
      
      // Set appropriate error message based on field type
      switch (field.type) {
          case 'email':
              errorElement.textContent = 'Please enter a valid email address.';
              break;
          case 'radio':
              // Only add one error message for radio groups
              const radioGroup = field.closest('.radio-group');
              if (radioGroup && !radioGroup.querySelector('.error-message')) {
                  errorElement.textContent = 'Please select an option.';
                  radioGroup.appendChild(errorElement);
              }
              return;
          default:
              errorElement.textContent = 'This field is required.';
      }
      
      // Insert error message after field
      field.parentNode.insertBefore(errorElement, field.nextSibling);
      
      // Add validation event listeners
      field.addEventListener('invalid', function(event) {
          event.preventDefault();
          this.classList.add('invalid');
          errorElement.style.display = 'block';
      });
      
      field.addEventListener('input', function() {
          if (this.validity.valid) {
              this.classList.remove('invalid');
              errorElement.style.display = 'none';
          }
      });
  });
  
  // Phone number validation
  const phoneField = document.getElementById('phone');
  if (phoneField) {
      phoneField.addEventListener('input', function(e) {
          // Format phone number as (XXX) XXX-XXXX
          let value = e.target.value.replace(/\D/g, '').substring(0, 10);
          
          if (value.length > 6) {
              value = `(${value.substring(0, 3)}) ${value.substring(3, 6)}-${value.substring(6)}`;
          } else if (value.length > 3) {
              value = `(${value.substring(0, 3)}) ${value.substring(3)}`;
          } else if (value.length > 0) {
              value = `(${value}`;
          }
          
          e.target.value = value;
      });
  }
  
  // Age validation (min 18, max 120)
  const ageField = document.getElementById('age');
  if (ageField) {
      ageField.addEventListener('input', function() {
          const age = parseInt(this.value);
          if (age < 18) {
              this.setCustomValidity('You must be at least 18 years old.');
          } else if (age > 120) {
              this.setCustomValidity('Please enter a valid age (up to 120).');
          } else {
              this.setCustomValidity('');
          }
      });
  }
}

/**
* Handles form submission
*/
function setupFormSubmission() {
  const form = document.getElementById('survey-form');
  
  if (!form) return;
  
  form.addEventListener('submit', function(event) {
      event.preventDefault();
      
      // Perform validation
      if (!validateForm(this)) {
          // If validation fails, scroll to the first invalid element
          const firstInvalid = this.querySelector('.invalid') || this.querySelector(':invalid');
          if (firstInvalid) {
              firstInvalid.focus();
              scrollToElement(firstInvalid);
          }
          return;
      }
      
      // Show submission confirmation
      showSubmissionConfirmation();
      
      // In a real implementation, form data would be sent to a server here
      // For now, we'll just log the form data
      const formData = new FormData(form);
      console.log('Form data submitted:');
      for (const [key, value] of formData.entries()) {
          console.log(`${key}: ${value}`);
      }
  });
}

/**
* Validates the entire form
*/
function validateForm(form) {
  // Check each required field
  let isValid = true;
  
  // Get all required inputs
  const requiredInputs = form.querySelectorAll('[required]');
  requiredInputs.forEach(input => {
      // Skip radio buttons that aren't the first in their group
      if (input.type === 'radio') {
          const name = input.name;
          const radioGroup = form.querySelectorAll(`input[name="${name}"]`);
          if (input !== radioGroup[0]) return;
          
          // Check if any radio in the group is checked
          const isChecked = Array.from(radioGroup).some(radio => radio.checked);
          if (!isChecked) {
              isValid = false;
              // Show error for the group
              const errorMsg = form.querySelector(`#${input.id}-error`) || 
                              input.closest('.radio-group').querySelector('.error-message');
              if (errorMsg) {
                  errorMsg.style.display = 'block';
              }
              input.classList.add('invalid');
          }
          return;
      }
      
      // Standard validation for other inputs
      if (!input.validity.valid) {
          isValid = false;
          input.classList.add('invalid');
          const errorMsg = form.querySelector(`#${input.id}-error`);
          if (errorMsg) {
              errorMsg.style.display = 'block';
          }
      }
  });
  
  // Check conditional validations
  if (document.getElementById('source').value === 'other') {
      const otherSource = document.getElementById('other-source');
      if (!otherSource.value.trim()) {
          isValid = false;
          otherSource.classList.add('invalid');
      }
  }
  
  if (document.getElementById('features-other').checked) {
      const otherFeatures = document.getElementById('other-features');
      if (!otherFeatures.value.trim()) {
          isValid = false;
          otherFeatures.classList.add('invalid');
      }
  }
  
  return isValid;
}

/**
* Shows a submission confirmation message
*/
function showSubmissionConfirmation() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.className = 'submission-overlay';
  overlay.style.position = 'fixed';
  overlay.style.top = '0';
  overlay.style.left = '0';
  overlay.style.width = '100%';
  overlay.style.height = '100%';
  overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  overlay.style.display = 'flex';
  overlay.style.justifyContent = 'center';
  overlay.style.alignItems = 'center';
  overlay.style.zIndex = '1000';
  
  // Create confirmation message
  const message = document.createElement('div');
  message.className = 'submission-message';
  message.style.backgroundColor = '#fff';
  message.style.padding = '30px';
  message.style.borderRadius = '8px';
  message.style.maxWidth = '500px';
  message.style.textAlign = 'center';
  message.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  message.style.animation = 'fadeIn 0.5s ease-out';
  
  message.innerHTML = `
      <h2 style="color: #3a5a78; margin-bottom: 20px;">Thank You!</h2>
      <p style="margin-bottom: 20px;">Your survey response has been submitted successfully.</p>
      <p style="margin-bottom: 30px;">We appreciate your feedback!</p>
      <button id="close-confirmation" style="background-color: #3a5a78; color: white; border: none; padding: 10px 20px; font-size: 16px; border-radius: 4px; cursor: pointer;">Close</button>
  `;
  
  overlay.appendChild(message);
  document.body.appendChild(overlay);
  
  // Add close functionality
  document.getElementById('close-confirmation').addEventListener('click', function() {
      document.body.removeChild(overlay);
      document.getElementById('survey-form').reset();
      resetFormState();
  });
}

/**
* Reset form state (clear validation errors, etc.)
*/
function resetFormState() {
  // Hide error messages
  const errorMessages = document.querySelectorAll('.error-message');
  errorMessages.forEach(error => {
      error.style.display = 'none';
  });
  
  // Remove invalid class from inputs
  const invalidInputs = document.querySelectorAll('.invalid');
  invalidInputs.forEach(input => {
      input.classList.remove('invalid');
  });
  
  // Hide conditional fields
  const conditionalFields = document.querySelectorAll('#other-source-container, #other-features-container');
  conditionalFields.forEach(field => {
      field.style.display = 'none';
  });
  
  // Reset character counter
  const commentField = document.getElementById('comments');
  if (commentField) {
      const counter = commentField.parentNode.querySelector('.character-counter');
      if (counter) {
          counter.innerHTML = `0/500 characters`;
          counter.style.color = '';
      }
  }
}

/**
* Setup confirmation for form reset
*/
function setupResetConfirmation() {
  const resetButton = document.getElementById('reset');
  
  if (!resetButton) return;
  
  resetButton.addEventListener('click', function(event) {
      event.preventDefault();
      
      if (confirm('Are you sure you want to reset the form? All your input will be lost.')) {
          document.getElementById('survey-form').reset();
          resetFormState();
      }
  });
}

/**
* Scrolls smoothly to an element
*/
function scrollToElement(element) {
  const yOffset = -20; 
  const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
  
  window.scrollTo({
      top: y,
      behavior: 'smooth'
  });
}