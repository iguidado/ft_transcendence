/**
 * Generates setting elements based on a list of setting objects
 * @param {Array} settingsList - Array of setting objects with properties: title, value, min, max, step, minusCallback, plusCallback
 * @param {string} containerId - ID of the container element where settings will be generated
 * @returns {Object} - Object with setting values that can be referenced later
 */
export function appendCustomSettings(settingsList, containerId = 'settings-list-container') {
  const container = document.getElementById(containerId)
  const settingsValues = {}

  container.innerHTML = ''

  settingsList.forEach(setting => {
    const { 
      title, 
      value, 
      min = 0, 
      max = 100, 
      step = 1, 
      minusCallback, 
      plusCallback 
    } = setting

    settingsValues[title] = value

    const settingContainer = document.createElement('div')
    settingContainer.className = 'setting-container'

    const titleContainer = document.createElement('div')
    titleContainer.className = 'setting-title-container'

    const titleElement = document.createElement('h3')
    titleElement.textContent = title

    titleContainer.appendChild(titleElement)

    const valueContainer = document.createElement('div')
    valueContainer.className = 'value-container'

    const minusBtn = document.createElement('div')
    minusBtn.className = 'minus-btn'

    const minusBar = document.createElement('div')
    minusBar.className = 'btn-bar minus-bar'

    minusBtn.appendChild(minusBar)

    const valueDisplay = document.createElement('p')
	valueDisplay.className = 'value'
	if (!isNaN(value)) {
		// Limit to maximum 2 decimal places without forcing zeros
		valueDisplay.textContent = Math.round(value * 100) / 100
	} else {
		valueDisplay.textContent = value
	}

    const plusBtn = document.createElement('div')
    plusBtn.className = 'plus-btn'

    const plusHorizontalBar = document.createElement('div')
    plusHorizontalBar.className = 'btn-bar horizontal-bar'

    const plusVerticalBar = document.createElement('div')
    plusVerticalBar.className = 'btn-bar vertical-bar'

    plusBtn.appendChild(plusHorizontalBar)
    plusBtn.appendChild(plusVerticalBar)

    let minusInterval
    let plusInterval
    const intervalSpeed = 100

    minusBtn.addEventListener('mousedown', () => {
      const decreaseValue = () => {
        const currentValue = parseFloat(valueDisplay.textContent)
        if (currentValue > min) {
          const newValue = Math.max(min, currentValue - step)
          valueDisplay.textContent = newValue
          settingsValues[title] = newValue

          if (typeof minusCallback === 'function') {
            minusCallback(newValue)
          }
        }
      }

      decreaseValue()
      minusInterval = setInterval(decreaseValue, intervalSpeed)
    })

    minusBtn.addEventListener('mouseup', () => {
      clearInterval(minusInterval)
    })

    minusBtn.addEventListener('mouseleave', () => {
      clearInterval(minusInterval)
    })

    plusBtn.addEventListener('mousedown', () => {
      const increaseValue = () => {
        const currentValue = parseFloat(valueDisplay.textContent)
        if (currentValue < max) {
          const newValue = Math.min(max, currentValue + step)
          valueDisplay.textContent = newValue
          settingsValues[title] = newValue

          if (typeof plusCallback === 'function') {
            plusCallback(newValue)
          }
        }
      }

      increaseValue()
      plusInterval = setInterval(increaseValue, intervalSpeed)
    })

    plusBtn.addEventListener('mouseup', () => {
      clearInterval(plusInterval)
    })

    plusBtn.addEventListener('mouseleave', () => {
      clearInterval(plusInterval)
    })

    valueContainer.appendChild(minusBtn)
    valueContainer.appendChild(valueDisplay)
    valueContainer.appendChild(plusBtn)

    settingContainer.appendChild(titleContainer)
    settingContainer.appendChild(valueContainer)

    container.appendChild(settingContainer)
  })
  return settingsValues
}
