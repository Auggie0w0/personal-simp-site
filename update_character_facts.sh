#!/bin/bash

# This script updates character facts for all character profiles

# Update Dazai's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>Birthday: June 19</li>\
                <li>Age: 22 (following timeline for main story)</li>\
                <li>Role: Member of the Armed Detective Agency; previously with the Port Mafia</li>\
                <li>Personality: Intelligent, witty, and ironically suicidal—balances dark humor with depth and loyalty</li>\
            </ul>\
            ' dazai.html

# Update Hange's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>Birthday: September 5</li>\
                <li>Age: Approximately 32 during main storyline</li>\
                <li>Role: Squad Leader, later becomes 14th Commander of the Survey Corps</li>\
                <li>Personality: Curious, eccentric "scientist" vibe—brilliant, empathetic, deeply driven by research</li>\
            </ul>\
            ' hange.html

# Update Lee Know's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>Birthday: October 25, 1998 (age ~26 in 2025)</li>\
                <li>Role: Main dancer and visual of Stray Kids; also contributes as a rapper/vocalist</li>\
                <li>Personality: Charismatic, disciplined performer; caring, "hyung" presence; well-trained in martial arts and dance</li>\
            </ul>\
            ' minho.html

# Update Ivan's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>Birthday: Unknown</li>\
                <li>Age: Unknown</li>\
                <li>Role: Contestant performer on Alien Stage: Prologue, known for "Black Sorrow" and reaching Top 3</li>\
                <li>Personality: Not officially documented; fan discussions focus more on visual appeal</li>\
            </ul>\
            ' ivan.html

# Update Saja's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>Birthday: N/A (fictional demon band)</li>\
                <li>Age: N/A</li>\
                <li>Role: Antagonistic demon-boy band aiming to break the Honmoon barrier</li>\
                <li>Personality: Villainous, high-energy idols entwined with demonic intent</li>\
            </ul>\
            ' saja.html

# Update Huntrix's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>Birthday/Ages: Not revealed</li>\
                <li>Role: K-pop girl group who secretly protect the world from demons via song</li>\
                <li>Personality - Rumi: Half-demon, emotionally complex leader</li>\
                <li>Personality - Mira: Energetic main dancer/visual</li>\
                <li>Personality - Zoey: Young rapper, creative maknae</li>\
            </ul>\
            ' huntrix.html

# Update Axel's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>Birthday: Unknown</li>\
                <li>Age: Unknown, likely early 20s</li>\
                <li>Role: Protagonist of Lazarus, a parkour-savvy escapee turned agent hunting Dr. Skinner</li>\
                <li>Personality: Agile, fearless, charismatic; described as "undeniably cool"</li>\
            </ul>\
            ' axel.html

# Update Wolfgang's facts (if needed)
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>He is the 4th Prince and current King of Goldenleonard</li>\
                <li>He lived as a beggar on the streets after his mother'"'"'s death</li>\
                <li>He has golden hair and eyes, a royal trait</li>\
                <li>He is known as the "God of Horse-racing"</li>\
                <li>He sacrificed himself to save other boys named Wolfgang</li>\
            </ul>\
            ' wolfgang.html

# Update Yamada's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>He is a professional gamer and streamer</li>\
                <li>His gaming handle is "Yamada"</li>\
                <li>He is known for being blunt and straightforward</li>\
                <li>He has a soft spot for cats</li>\
                <li>He is actually quite caring despite his cold exterior</li>\
            </ul>\
            ' yamada.html

# Update Miyamura's facts
sed -i '' '/<h3>Fun Facts<\/h3>/,/<\/ul>/ c\
            <h3>Fun Facts<\/h3>\
            <ul class="character-reasons">\
                <li>He has multiple piercings and tattoos</li>\
                <li>He is actually very kind and caring</li>\
                <li>He is skilled at cooking and housework</li>\
                <li>He has a secret side that he hides from most people</li>\
                <li>He is deeply in love with Hori and very protective of her</li>\
            </ul>\
            ' miyamura.html

echo "Character facts updated successfully!" 