export function appendCustomSettings(settingsList, containerId = 'settings-list-container') {
  const container = document.getElementById(containerId)
  const settingsValues = {}

  container.innerHTML = ''

  settingsList.forEach(setting => {
    const { 
      title, 
      defaultValue,
      minusCallback, 
      plusCallback,
      isKeybind 
    } = setting

    settingsValues[title] = defaultValue

    const settingContainer = document.createElement('div')
    settingContainer.className = 'setting-container'

    const titleContainer = document.createElement('div')
    titleContainer.className = 'setting-title-container'

    const titleElement = document.createElement('h3')
    titleElement.textContent = title

    titleContainer.appendChild(titleElement)

    const valueContainer = document.createElement('div')
    valueContainer.className = 'value-container'

    if (isKeybind) {
        const changeKeyBtn = document.createElement('button')
        changeKeyBtn.className = 'keybind-btn'
        changeKeyBtn.textContent = defaultValue
        
        changeKeyBtn.addEventListener('click', async () => {
            const newValue = await plusCallback()
            changeKeyBtn.textContent = newValue
            settingsValues[title] = newValue
        })

        valueContainer.appendChild(changeKeyBtn)
    } else {
        const minusBtn = document.createElement('div')
        minusBtn.className = 'minus-btn'

        const minusBar = document.createElement('div')
        minusBar.className = 'btn-bar minus-bar'

        minusBtn.appendChild(minusBar)

        const valueDisplay = document.createElement('p')
        valueDisplay.className = 'value'
        if (!isNaN(defaultValue)) {
            valueDisplay.textContent = Math.round(defaultValue * 100) / 100
        } else {
            valueDisplay.textContent = defaultValue
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
                const currentValue = settingsValues[title]
                minusCallback(currentValue).then(res => {
                    settingsValues[title] = res
                    if (!isNaN(settingsValues[title])) {
                        valueDisplay.textContent = Math.round(settingsValues[title] * 100) / 100
                    } else {
                        valueDisplay.textContent = settingsValues[title]
                    }
                })
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
                const currentValue = settingsValues[title]
                plusCallback(currentValue).then(res => {
                    settingsValues[title] = res
                    if (!isNaN(settingsValues[title])) {
                        valueDisplay.textContent = Math.round(settingsValues[title] * 100) / 100
                    } else {
                        valueDisplay.textContent = settingsValues[title]
                    }
                })
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
    }

    settingContainer.appendChild(titleContainer)
    settingContainer.appendChild(valueContainer)

    container.appendChild(settingContainer)
  })
  return settingsValues
}
