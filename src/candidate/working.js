import React, { useState } from "react"
import { Input } from "baseui/input"
import emojis from "./emojis.json"
import "./style.css"

// Function to convert emoji codes to their Unicode representations
const convertEmojiCodes = (emojiData) => {
    return emojiData.map((data) => {
        if (data.unicode.startsWith("U+")) {
            const codePoint = parseInt(data.unicode.replace("U+", ""), 16)
            data.unicode = String.fromCodePoint(codePoint)
        }
        return data
    })
}

function FancyInput({ placeholder }) {
    const [value, setValue] = useState("")
    const [showEmojiPicker, setShowEmojiPicker] = useState(false)
    const [filteredEmojis, setFilteredEmojis] = useState([])

    // Convert emoji codes to Unicode representations
    const convertedEmojis = convertEmojiCodes(emojis)

    const handleInputChange = (e) => {
        const text = e.target.value
        let newValue = text

        // Check if the text contains a colon followed by 2 or more alphanumeric characters
        const colonIndex = text.lastIndexOf(":")
        if (
            colonIndex !== -1 &&
            text.substring(colonIndex + 1).match(/\w{2,}/)
        ) {
            const inputText = text.substring(colonIndex + 1)
            const filtered = convertedEmojis.filter((emojiData) =>
                emojiData.code.includes(inputText)
            )
            setFilteredEmojis(filtered)
            setShowEmojiPicker(filtered.length > 0)
        } else {
            setShowEmojiPicker(false)
        }

        // Replace full emoji code with emoji if it matches exactly
        convertedEmojis.forEach((emojiData) => {
            const { code, unicode } = emojiData
            if (text.includes(code)) {
                newValue = newValue.replace(code, unicode)
            }
        })

        setValue(newValue)
    }

    const handleEmojiSelect = (unicode) => {
        const lastIndex = value.lastIndexOf(":")
        const newValue =
            value.substring(0, lastIndex) +
            unicode +
            value.substring(value.length)
        setValue(newValue)
        setShowEmojiPicker(false)
    }

    return (
        <>
            <Input
                placeholder={placeholder}
                value={value}
                onChange={handleInputChange}
            />
            {showEmojiPicker && (
                <div className="emoji-picker">
                    <div className="search-result-title">Search Results</div>
                    {filteredEmojis.map((emojiData) => (
                        <span
                            key={emojiData.code}
                            onClick={() => handleEmojiSelect(emojiData.unicode)}
                            dangerouslySetInnerHTML={{
                                __html: emojiData.unicode,
                            }}
                        />
                    ))}
                </div>
            )}
        </>
    )
}

export { FancyInput }
