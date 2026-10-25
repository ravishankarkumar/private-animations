# Youtube Title
AI vs Machine Learning vs Deep Learning vs Generative AI — Explained with One Practical Example

## Description

AI, machine learning, deep learning, and generative AI are often used interchangeably—but they describe different goals, methods, models, and capabilities.

In this visual explainer, we use one practical example—a suspicious email—to understand how these technologies differ.

The email activates several systems:

- A rule-based AI system flags the warning signs.
- A machine-learning model calculates a 96% spam probability.
- A deep neural network recognises the dog in the attachment.
- A generative AI system drafts a reply—but confidently writes the wrong day.

Following this single email, we explore:

- Why AI does not always involve learning
- How machine learning learns patterns from examples
- The difference between training and inference
- What model parameters and neural-network weights represent
- Why deep learning is called “deep”
- How a neural network learns useful features
- How generative AI differs from a system that only classifies
- What foundation models and large language models are
- How an LLM generates text one token at a time
- Why fluent AI output can still contain hallucinations
- How Data Science relates to AI and machine learning
- Why AI systems still need testing, verification, and human oversight

By the end, you’ll have a clear mental map connecting AI, machine learning, deep learning, foundation models, LLMs, generative AI, and Data Science—without treating them as synonyms.

If this explanation helped, subscribe for more visual breakdowns of AI, software, and technology.

What should we explain next: how training changes the weights, attention, or how a model is tested?

References and further viewing:

- [IBM Technology: AI, Machine Learning, Deep Learning and Generative AI Explained](https://www.youtube.com/watch?v=qYNweeDHiyU)

#ArtificialIntelligence #MachineLearning #GenerativeAI #deeplearning #neuralnetwork

## Thumbnail idea

[Thumbnail Idea](./thumbnail-idea.md)

## In the top-right corner, a Kavriq bubble animation will keep playing in a loop throughout the video.

## Persistent terminology legend

Keep a small, screen-fixed legend in the opposite corner throughout the explanation:

**AI · ML · Data Science · DL · GenAI · Foundation Model · LLM**

The terms begin muted. Light each term in its established concept colour when it is first explained, then leave it visibly completed. The legend is never read aloud; it acts as a progress indicator and reminds viewers that the video is separating related but different terms.

## Stable concept palette

Keep each concept in the same colour across email-result cards, explainer screens, the master map, and the summary.

| Concept | Solid fill | Bright accent |
| --- | --- | --- |
| Artificial Intelligence | `#17647D` | `#31D7FF` |
| Machine Learning | `#1E7A55` | `#57E3A1` |
| Deep Learning | `#53368A` | `#9B6DFF` |
| Generative AI | `#C4485C` | `#FF5FA2` |
| Deep Learning + Generative AI | `#35194F` | — |
| Foundation Model / LLM card | `#9A5A20` | `#FF9F43` |
| Data Science | `#677585` | `#9AA7C1` |
| Machine Learning + Data Science | `#123744` | — |
| Warning and incorrect states | — | `#FF6B5F` |

The background is `#070A16`, neutral panels use `#141C32`, and text placed on solid regions uses `#F8FAFC`. Map regions are solid opaque shapes—not transparent overlays or coloured outlines. Use the dedicated darker solid colour for each partial overlap. AI contains Machine Learning, and Machine Learning contains Deep Learning, so containment does not receive a blended intersection colour.

Keep a narrow background-coloured gutter where neighbouring solid regions require separation. A Foundation Model or LLM remains orange even when placed inside Deep Learning; the tokens or content it generates remain rose. The email itself stays neutral.

## Editorial and animation principles

- Keep the email and its incorrect day as the narrative spine.
- Show the concrete result before naming the abstract term.
- Give every major definition one uncluttered visual beat before opening the deeper mechanism.
- Every spoken transition should cause a visible change; avoid unexplained pauses.
- Treat diagrams as transformations of existing objects rather than unrelated chapter cards.
- Keep the explanation understandable without the depth beat; the extra animation should enrich the concept, not carry a prerequisite for the next section.

## Overall Structure

1. Introduction: Introduce one email, four AI-powered results, and the incorrect Tuesday-to-Wednesday reply.
2. Explain rule-based AI through the email-warning checklist.
3. Explain machine learning through the spam score, training, and inference.
4. Briefly compare Data Science with machine learning, and name supervised learning as the type used on this email.
5. Explain deep learning and neural networks through the dog attachment.
6. Explain generative AI through the drafted response and token-by-token generation.
7. Introduce foundation models, LLMs, and how one model can support several jobs.
8. Explain hallucinations, deepfakes, bias, privacy, and the need for verification.
9. Summarize everything by placing the email’s four results onto the final concept map.


## 1. Introduction

-> Live camera feed
Artificial Intelligence—or AI—Machine Learning, Deep Learning, and Generative AI can feel mysterious to many people. They are often treated like a black box that somehow performs magic.

If that is how they feel to you, you have come to the right place. By the end of this video, you will understand these concepts well enough to explain them clearly to someone else. That is my promise.

-> Live camera feed ends: Exact time -> 28.26 seconds (global time)
-> ANimation starts

Let us start with this sample email. Four different AI systems have worked on it.

The first one flagged it as suspicious.
The second classified it as spam.
The third one recognised the dog in the attachment.
And the fourth one wrote this draft reply.

But there is a problem. The email says **Tuesday**, while the draft confidently says **Wednesday**.

This single email gives us a practical way to separate Artificial Intelligence, Machine Learning, Deep Learning, and Generative AI. We will examine each result, understand the mechanism behind it, and gradually build a clear map showing how these concepts are related—and how they differ.

We will also see why generative AI can confidently be wrong—a problem called **hallucination**—and how to build reliable systems around it.

-> Animation ends global time 1 min 25.09 seconds

### 1. Introduction - Animation

Timecodes in this section use `minutes:seconds:frames` at 30 frames per second.

- Animation begins at `00:28:26` global time, immediately after the live camera feed ends.
- “Let us start with this sample email” begins at `00:30:25`.
- “Four different AI systems” begins at `00:33:11`.
- The first system begins at `00:36:11`.
- The second system begins at `00:39:11`.
- The third system begins at `00:43:11`.
- The fourth system begins at `00:46:11`.
- “But there is a problem” begins at `00:49:11`.
- The Tuesday-to-Wednesday discrepancy begins at `00:52:00`.
- AI, Machine Learning, Deep Learning, and Generative AI are named from `01:00:00`.
- Hallucination is introduced at `01:16:14`.
- Segment 1 officially ends at `01:25:09` global time.

Start on a fresh animation screen using the standard `#070A16` background. A direct screen change from the real footage is acceptable. Do not carry the wave mesh into this scene, fade it down, or try to morph it into the animation.

Keep the Kavriq logo fixed at the top-right. Open on the envelope against the otherwise empty screen. Between `00:28:26` and `00:30:25`, the envelope enters and immediately begins opening. As the narrator says, “Let us start with this sample email,” the email card rises from the envelope and moves to centre stage. The opening should feel deliberate but compact; do not force separate entrance, settling, and opening pauses into this short lead-in. Do not open on a newspaper montage or a terminology screen. Newspapers belong to the generative-AI section.

The email card uses the neutral panel `#141C32` and contains only these readable fields:

- Sender: `unknown.sender@fast-confirm.net`
- Subject: `URGENT: Meeting moved`
- Body: `The meeting is Tuesday at 10:00.`
- Link: `Confirm meeting`
- Attachment: `dog-photo.jpg`
- Draft reply: `See you Wednesday at 10:00.`

The message never contains the word spam. The sender line, the urgent subject, and the confirmation link are the evidence used by the suspicious-message and spam systems. The Tuesday sentence and the dog attachment stay unconnected to those two results.

At `00:33:11`, four subtle empty result positions appear around the email—two above it and two below it. As each result is described, its card occupies one of those positions. Draw its connectors as it appears, and keep them tracking their source and destination on every frame:

- At `00:36:11`, **FLAGGED** appears above-left. Briefly illuminate the sender, urgent subject, and confirmation link. Three animated paths travel from those fields into the card.
- At `00:39:11`, **SPAM** appears above-right. Pulse the same sender, subject, and link fields. Let those three pulses converge visually at one small junction on the email’s edge, then draw a single connector from that junction to **SPAM**. Do not add a second set of three arrows, and do not show a probability in this introductory email interface. The underlying spam score will be revealed later while explaining machine learning.
- At `00:43:11`, **DOG DETECTED** appears below-left. Briefly scan the attachment and connect it to the result. Do not show `98%` here. The model’s confidence score will be revealed later while explaining deep learning.
- At `00:46:11`, **DRAFT REPLY** appears below-right. The reply is already fully written inside the email; simply draw one connector from that existing reply to the result card. Do not animate token-by-token generation in the introduction. That mechanism belongs in the Generative AI section.

At `00:49:11`, briefly reduce the prominence of the four result cards without hiding them. Keep the email and its draft fully visible. At `00:52:00`, highlight **Tuesday** in the incoming message, then **Wednesday** in the draft. Draw a warning connection between them and form the **TUE → WED** pill. Use warning `#FF6B5F`, not the Generative AI rose. Park the pill immediately below the Kavriq logo so the two elements do not collide.

At `01:00:00`, return all four cards to equal prominence. As the four technologies are named, briefly flash a small callout beside the corresponding result: **AI** beside **FLAGGED**, **MACHINE LEARNING** beside **SPAM**, **DEEP LEARNING** beside **DOG DETECTED**, and **GENERATIVE AI** beside **DRAFT REPLY**. Pulse each result once in narration order. These callouts are synchronized labels for the spoken sentence, not permanent badges or a taxonomy. Fade each callout after its beat so the four cards do not settle into four apparently equal categories.

After the temporary callouts fade, introduce a small, visually muted journey legend containing **AI · ML · DL · GenAI**. It functions only as a list of concepts the video will visit; it must not resemble four equal cards or imply structural equivalence. The hierarchy and containment relationships will be constructed progressively in later sections. Add Data Science, Foundation Model, and LLM to the journey legend only when they are introduced.

At `01:16:14`, pulse **TUE → WED** again and reveal the term **HALLUCINATION** beside it. During “build reliable systems around it,” place a dashed **VERIFY OUTPUT** boundary around the generated reply. Do not show a green tick or imply that the reply has already been verified.

Hold the complete composition through `01:25:09`, when Segment 1 officially ends. The email, the four user-facing results, their connectors, the muted journey legend, and the parked error pill remain available for the opening rearrangement in Segment 2. The temporary technology callouts are no longer visible.

## 2. Explain rule-based AI through the email-warning checklist.

Let us look at the system that flagged this email as suspicious.

Someone wrote the rules, and this email matched three of them:

- an unknown sender,
- urgent wording,
- and a confirmation link.

So the system marked it as suspicious.

This is a simple rule-based AI system: it imitates a decision that a human might otherwise make by following instructions written by people.

In fact, **ELIZA**, one of the first famous chatbots, was a rule-based system. And people still call it an AI chatbot.

ELIZA gained fame in the 1960s, decades before deep learning began powering many of today's AI systems.

-> Real camera footage with my face

But don't get the wrong idea about what people usually mean by AI today. Today, they almost always mean that a machine-learning model is doing the main job under the hood.

However, the model is not the entire application. The model makes a prediction, but other software decides what data to give it, when to use its output, how to verify it, and what action to take. Together, the model and this surrounding engineering form the AI application. That is why many AI engineers, including me, have never built a machine-learning model themselves.

And there is a reason why rules alone are often not enough. Once spammers discover which signals the spam detector is looking for, they can begin working around them. This can make the spam-detection system less effective unless someone discovers the new tactics and updates the rules.

That is why these rule-based systems become brittle, and why machine learning matters. That is what we will look at next.

-> Return of animation

So, in our Venn diagram, AI will occupy the largest region.

### 2. Animation

This screen begins where the introduction finished. The result connectors are already tracking the email.

Then, the **FLAGGED** card is highlighted while the other three cards dim. A copy of the **FLAGGED** card is created in exactly the same position. The copy moves into the empty space on the screen to the right (`x = [8, 24]`, `y = [-4.5, 4.5]`), while the original card remains dimmed.

**FLAGGED** becomes **RULES**, and a parchment scroll opens beneath it. Fill the scroll with many faint lines that suggest written rules without displaying actual text.

As these three warning signals are spoken:

- Unknown sender.
- Urgent wording.
- Confirmation link.

Three separate lines on the scroll resolve into these labels, and a checkbox is drawn beside each one.

When the narration reaches ELIZA, the scroll slides away. **RULES** becomes **ARTIFICIAL INTELLIGENCE** and moves to the top centre.

Draw a horizontal timeline across the centre of the screen. Use one concise sequence that combines the terminology milestones with the broader shifts in AI:

- **1956 — AI BECOMES A FIELD**
- **1959 — MACHINE LEARNING**
- **1966 — ELIZA**
- **1980s — EXPERT SYSTEMS BOOM**
- **2012 — DEEP-LEARNING BREAKTHROUGH**
- **2022 — CHATGPT LAUNCHES**

Keep this timeline visually brief; the narration does not need to stop and explain every milestone. When **ELIZA** is spoken, highlight the **1966 — ELIZA** marker.

When the animation returns after the real-camera footage, the milestone labels vanish. The timeline morphs into a circle using the newly implemented shape-morph animation, and **AI** moves inside it.

The circle, now grouped with the **AI** label, fills with the chosen AI colour. It bounces naturally a few times before coming to rest.

Make the circle large enough to hold four nested layers later: AI, Machine Learning, Deep Learning, and Generative AI, in the proportion 5:4:3:2. The finished circle sits just below the frame centre so those later circles can share its bottom, with only a thin gap, matching the desktop Venn. **AI** sits in the upper part of the circle, where the outer crescent will be.

## 3. Explain machine learning through the spam score, training, and inference.

Machine learning is one way to build AI. Instead of writing every rule by hand, we show examples to a model, and it learns patterns from them.

The system that marked this email as spam had been shown many earlier emails. Each one had already been labelled as spam or not spam. Showing the model those examples and letting it adjust is called training.

Once training is complete, the model's learned parameters are held fixed while it is being used. The trained model can then predict or score new emails; this step is called inference. In our simplified example, the model assigned this email a 96 percent spam score, so the application labelled it **Spam**.

These two steps are easier to understand with another example. Here is data from past plot sales in Muzaffarpur. Looking at the sales near 4,000 square feet, what price would you guess? Around ₹60 lakh, or ₹6 million, right?

The line you see on screen starts in the wrong position. It is then adjusted live to minimise its overall error when predicting the prices of past sales.

Congratulations! You have found the line with the lowest error among the ones we tried: `y = 14x + 7`. Your simple machine-learning model is now trained.

Let's use it to estimate the price of a 4,000-square-foot plot. Because `x` is measured in thousands of square feet, 4,000 square feet means `x = 4`. The predicted price is ₹63 lakh, or ₹6.3 million.

Adjusting the line using the past sales was training. Using the finished line to predict a new price was inference.

Advances in mathematics and computing have made machine-learning models useful across many fields. But the central idea remains the same: learn patterns during training, then use what was learned during inference.

So, the model that produced the spam score belongs inside the Machine Learning region of AI, while the rule-based checklist remains in the broader AI region, outside Machine Learning.

### Machine learning animation

This segment uses the same three-screen world established earlier:

- **Main email screen:** centred at `[0, 0]`.
- **AI diagram screen:** centred at `[16, 0]`.
- **Machine Learning explainer screen:** centred at `[0, 9]`.

The animation begins on Segment 2's exact closing frame: the larger solid AI circle on the AI diagram screen. Keep the camera at normal zoom through the moves between the three screens. Before the ball leaves the Machine Learning page, zoom out once so that page and the diagram both stay in frame, hold the camera still while the ball moves, and return to the diagram only after the ball has settled.

#### 1. Let the spam result lead us into Machine Learning

Track horizontally from the AI diagram back to the email. Brighten the original **SPAM** card, create a copy in the same position, and dim the original once the copy separates.

The copied card moves upward, and the camera follows a fraction of a second later without pausing at the screen boundary. During the movement, unwrite **SPAM** and write **MACHINE LEARNING** on the same card. As the new title is written, visibly widen the card into a proper title banner. Do not add a subtitle inside this banner. It settles as the title on the upper screen. Beneath it, write the dominant takeaway:

**LEARNS PATTERNS FROM EXAMPLES**

The email, its four original results, their continuously tracking connectors, and the **TUE → WED** chip remain intact on the screen below.

#### 2. Establish training with labelled emails

Keep the Machine Learning title banner and its takeaway centred. Only the training simulation beneath them should be shifted slightly to the right so the examples have room to enter from the left.

Show a compact model on the right containing five or six large parameter gauges. The example emails should use the same visual language as the email established in the introduction: a dark inbox surface, top bar, sender/avatar row, subject and message lines. Keep only the information that remains readable at this smaller scale, and place the known **SPAM** or **NOT SPAM** label on the card.

Send four clearly labelled examples into a small **TEXT → NUMBERS** box between the emails and the parameter model. Give it the subtitle **NUMERICAL FEATURES**. It represents converting the content of each email into numerical values that the model can process. Depending on the model, these may be engineered features, values such as TF-IDF scores, or learned representations.

- **SPAM** — urgent transfer.
- **NOT SPAM** — team update.
- **SPAM** — prize waiting.
- **NOT SPAM** — project review.

As each email enters the **TEXT → NUMBERS** box, let a rapid stream of numerical values emerge from its other side. The values travel into the parameter model. Bring up **ERROR → UPDATE** on the first adjustment and leave it readable through the rest of the examples. Pulse the label as each example updates the gauges, then fade it as inference begins. The gauges still make a small adjustment with each example. Repeat the examples quickly so the numerical vectors feel almost continuous. Show **TRAINING** and **INFERENCE** as a two-state phase selector beneath the model. Keep **TRAINING** brightly filled and **INFERENCE** dim throughout this sequence.

#### 3. Contrast it with inference

At the transition, dim **TRAINING**, brightly fill **INFERENCE** in cyan, and reveal **PARAMETERS LOCKED**. Send one unlabelled **NEW EMAIL** through the same **TEXT → NUMBERS** box. Its numerical values still travel into the model, but there is no error/update pulse and none of the locked gauges move. Keep the output card visually separate from the model, with a clear gap between their surfaces. Resolve the result in two beats, on one compact green pill sized to those two lines. Pad the pair evenly. **SPAM** stays the larger line; **96%** is a step smaller and still white.

1. **SPAM**
2. **96%**

The application-facing label and the model's illustrative internal score should remain visually distinct. Clear the pipeline after one short hold; do not replay it.

#### 4. Make the plot-price example the main technical explanation

Write **PLOT PRICES IN MUZAFFARPUR**. Show a short CSV with six readable rows, then move it right while a graph appears on the left. Highlight each CSV row and transfer a corresponding dot to the graph. The dots form a plausible upward trend without lying perfectly on one line.

At `4,000` square feet, show the viewer's intuitive estimate with amber guides and **₹60 LAKH**. Do not draw a fitted model line during this beat; this is a human reading the nearby cluster.

Remove only the estimate guides, fade the CSV, and introduce `y = ax + b`. Draw one deliberately poor line with residuals, parameter chips, and an error indicator. Use three deliberate training states:

1. A clearly poor line with large error.
2. A closer line with shorter residuals.
3. The final line with the lowest displayed error.

Settle on:

**`y = 14x + 7`**

Lock `a = 14` and `b = 7` and mark the model **TRAINED**.

On **“Congratulations!”**, clear the temporary **LOWEST ERROR** label and reveal the fitted equation and **TRAINED** state. Fire a restrained burst of Veena fireworks over the screen in the Machine Learning green, cyan, and amber palette. Let the fireworks accompany the first sentence, then fade them away while the clean trained-model frame remains visible for **“Your simple machine-learning model is now trained.”** Begin inference only after the full spoken line has finished.

#### 5. Use the trained line for inference

Transform **4,000 sq ft** into **`x = 4` thousand sq ft**, then write:

**`y = 14(4) + 7 = 63`**

A cyan guide rises from `x = 4` to the fixed trained line and moves across to **₹63 LAKH**. Neither the line nor its parameters move during this inference beat.

#### 6. Compress the explanation into one recap

Fade **PLOT PRICES IN MUZAFFARPUR** with the graph. Keep the **MACHINE LEARNING** pill green. Compress the graph into a smaller dark panel, `#141C32`, with a green edge. The panel holds only:

- A quiet caption: **PLOT PRICES IN MUZAFFARPUR**
- **MODEL** — `y = 14x + 7`
- Locked chips **a = 14** and **b = 7**

Under the panel, two bullets:

- A green bullet: **TRAINING** — adjust parameters using examples.
- A cyan bullet: **INFERENCE** — use the locked model on a new example.

Do not fill the panel with the ML green. Keep this recap static. Do not run another example through it.

#### 7. Add Machine Learning to the master diagram

Clear the recap. Zoom the camera out first, far enough to hold the Machine Learning page and the diagram together, and then keep the camera still. The **MACHINE LEARNING** pill morphs into a green ball that is already its final radius. Use one `ShapeMorph` from the rounded banner to that circle. Do not scale the banner down and cross-fade a second ball in, and do not grow the ball again after it lands. A short floor appears. The ball drops and bounces once. As it meets the floor again it jumps up on a slant toward the diagram, with no pause between the bounce and the jump. That floor leaves as it jumps, and a floor is waiting on the diagram. The ball falls onto that floor, gives two smaller bounces, and settles in its final seat. The camera does not move during the drop, the jump, or the landing.

The opening frame still matches Segment 2, including the larger AI circle, and that circle stays where Segment 2 left it. The two circles share a bottom, with a thin gap, the way the desktop Venn does. Machine Learning sits inside AI, low in the circle, and the names sit in the upper part of each region so Deep Learning and Generative AI can be added inside later. Do not draw those two layers yet. Its edge and fill use the same colour. Write **MACHINE LEARNING** in the upper part of the green circle, and leave **AI** in the outer crescent.

Do not place **FLAGGED**, **SPAM 96%**, or an explanatory sentence inside or beneath the circles. Keep the final master diagram clean: show only the nested regions and their names.

After the ball has settled, move the camera in on the diagram and hold this composition for Segment 4.



## 4. Briefly compare Data Science with machine learning, and name supervised learning as the type used on this email.

-> Live camera feed

Before we move deeper into Machine Learning, let's briefly compare it with another term we frequently encounter: Data Science.

-> Live camera feed ends here; animation starts

In our previous example, the system learned from emails labelled as spam or not spam. It then applied those learned patterns to a new email and predicted its spam score.

Data Science asks a broader set of questions about the data itself:
- How many spam emails arrive every day?
- Where do they come from?
- Is their number increasing?

To answer such questions, a data scientist may collect, clean, explore, visualise, and validate data — and sometimes build a machine-learning model.

So, Data Science and Machine Learning overlap, but they are not the same thing. Data Science can use Machine Learning as one of its tools. At the same time, building useful Machine Learning systems often relies on many of the same data-science practices, so that models learn from reliable data and their outputs can be evaluated and interpreted.

These labelled emails also tell us what kind of learning this was.

When we train a model using emails that have already been labelled as spam or not spam, that is called **supervised learning**. The model learns from examples for which the correct answer is already known.

Models can also discover structure in unlabelled data. This is called **unsupervised learning**. They can learn from a few labelled examples combined with many unlabelled ones — called **semi-supervised learning**. Or they can learn from rewards received after taking actions — called **reinforcement learning**.

For now, remember supervised learning. The spam model was trained this way, and so was the dog classifier we will examine next.


### 4. ML vs Data Science Animation

This segment continues from Segment 3's final taxonomy frame.

The persistent screens are now:

- **Main email screen:** `x = [-8, 8]`, `y = [-4.5, 4.5]`.
- **Machine Learning explainer screen:** `x = [-8, 8]`, `y = [4.5, 13.5]`.
- **AI diagram screen:** `x = [8, 24]`, `y = [-4.5, 4.5]`.
- **Data Science and learning-types screen:** `x = [24, 40]`, `y = [-4.5, 4.5]`.

During the live-camera section, hold Segment 3's final taxonomy frame completely still, including the Kavriq logo. When the live-camera section ends, slide the camera horizontally to the adjacent screen at `x = [24, 40]`, `y = [-4.5, 4.5]`. Do not zoom out between the two screens.

Begin with a short callback to the previous segment, split across two lines so it can be read at a glance. Use the same email card already on the main screen, scaled down. Do not draw a separate simplified email.

On the first line, several scaled copies gather. Each copy carries a visible **SPAM** or **NOT SPAM** mark, and the line ends at one **LEARNED PATTERNS** pill:

**[labelled emails] → LEARNED PATTERNS**

On the second line, a copy of that learned-patterns pill moves down and the unstamped sample email joins it. Together they lead to the score:

**LEARNED PATTERNS + [the email] → SPAM 96%**

Keep the result of the first line visible so both stages can be read together. This is only a recap. Do not repeat the training simulation or animate adjustable parameters again. Clear both lines once the contrast with Data Science is established.

First, write **DATA SCIENCE** by itself near the top of the screen. As the Data Science questions are spoken, show three warm-gold chips in the centre using the narration's wording:

- **HOW MANY PER DAY?**
- **WHERE DO THEY COME FROM?**
- **IS THE NUMBER INCREASING?**

When the comparison begins, move the question chips to the right and mute them. Fade the standalone **DATA SCIENCE** headline away; do not replace it with a comparison title.

Only after those elements settle, reveal two larger, already-overlapping solid circles in their final positions. Fill the left circle with Machine Learning green `#1E7A55`, the right circle with Data Science gold `#956B22`, and their larger explicit overlap lens with the consistent solid colour `#40512A`. Construct the lens from the same circular arcs as the two circles so no differently coloured slivers appear around its edge. Write **MACHINE LEARNING** and **DATA SCIENCE** inside their respective non-overlapping regions; do not add a title or **vs** above them. Do not place the Data Science circle beneath the question stack. Do not use transparency, drops, collisions, or bouncing, and do not imply that either field wholly contains the other.

Place the shared practices on separate lines inside the lens:

**COLLECT**  
**CLEAN**  
**EXPLORE**  
**VISUALISE**  
**VALIDATE**

Keep the three muted question chips visible to the right of the circles, with clear space between them and the Data Science circle. Do not add **INSIGHTS → DECISIONS** there. The opening callback has already shown the Machine Learning path from patterns to a prediction, so do not repeat **PATTERNS → PREDICTIONS** in the green-only area.

When the narration says that Data Science can use Machine Learning as one of its tools, replace the shared-practices list inside the overlap with:

**DATA SCIENCE CAN USE**  
**MACHINE LEARNING**  
**AS ONE TOOL**

Do not draw arrows to both circles; that would incorrectly suggest a symmetric tool relationship. Remove this statement before the learning-types transition.

Leave this comparison on the side screen. Do not add Data Science to the master diagram yet. The summary places it there, overlapping Machine Learning and extending beyond Artificial Intelligence.

For the learning types, move away from the Venn comparison and introduce the clearer, non-exhaustive heading **FOUR COMMON LEARNING APPROACHES**. Keep a larger green Machine Learning circle beneath it with generous space around the circle, then arrange a clean row of four cards lower on the screen. The cards should emerge from the green circle so that they clearly read as approaches used in Machine Learning:

- **SUPERVISED**
- **UNSUPERVISED**
- **SEMI-SUPERVISED**
- **REINFORCEMENT**

Keep all four cards visible. Light **SUPERVISED** when its sentence is spoken. Each of the other cards remains muted until its own sentence, lights briefly when named, and returns to its muted state afterward. Do not introduce self-supervised learning here; that term arrives with foundation models.

On **For now, remember supervised learning**, mute the other three cards and restore **SUPERVISED** as the sole active card. Keep **SUPERVISED** fully lit through the remainder of the segment; do not dim it on the final frame. Connect a small **SPAM 96%** callback to it first. Then add the familiar dog-attachment thumbnail beside the spam result and connect that to **SUPERVISED** as well. Keep both callbacks visible through the final line; do not replace the spam result with the dog.

The dog here is only the familiar thumbnail. Segment 5 still begins on the email and carries the full dog card to its own screen. Do not add either callback to the master diagram or alter Segment 3's clean closing frame.


## 5. Explain deep learning and neural networks through the dog attachment.

### 5A. From the dog classifier to Deep Learning

One of the AI systems that worked on this email looked at the attachment and recognised the dog in the picture. And no prize for guessing that this is also a machine-learning system.

It was trained on animal pictures labelled as cats, dogs, horses, and so on. So, like the spam model, it learned through supervised learning. But this model also uses a particular kind of Machine Learning called Deep Learning.

Deep learning is a machine learning technique that uses neural networks with many layers. It is called *deep* because many layers sit between the input and the answer. No other reason.

### 5B. Parameters and training

But how does the training happen?

In the plot-price example, the fitted line had only two adjustable parameters: `a` and `b`. During training, their values were adjusted to 14 and 7. A neural network can contain many more such parameters. Many of them are called weights, and in our simplified diagram, those weights sit on the connections between units.

A layer is one stage of calculation. Inside the network, the picture is represented as numbers. Those numbers pass through one layer, then the next, and then the next. The final layer produces the network's guess.

During training, this journey is repeated across many labelled pictures. The network's final guess is compared with the correct label. Based on how far the guess is from the correct answer, the weights are adjusted slightly. Across many examples, these adjustments help the network make better predictions.

The model is not simply storing all the pictures. It is learning patterns that help it predict a label for a new picture.

### 5C. What the layers learn

The layers can learn a hierarchy of useful features. Early layers may respond to simple edges. Later layers can combine those edges into textures and shapes, and deeper layers can assemble that evidence into a prediction such as **dog**. This is a simplified picture—not every network separates the steps so neatly—but it explains why multiple layers can be useful.

In many older Machine Learning systems, people had to decide which features the model should measure. Deep networks can learn many of those useful features directly from the training examples.

### 5D. Why it is called neural, and how inference works

Why call the network *neural*? “Neural” is a loose nod to the neurons in a brain. This is not a brain. It is layers of mathematics. Each artificial unit receives numbers from the previous layer, combines them, and passes a new number forward.

Once training ends and inference begins, the weights stay fixed. This attachment is a new picture, and it does not come with an answer label. The network makes one forward pass and predicts: dog, 98 percent. It can still be wrong.

### 5E. Why Deep Learning became powerful—and difficult to inspect

Larger datasets, faster chips, and better training methods made these networks increasingly effective. That progress drove major advances in computer vision, speech recognition, and language processing.

There is a trade-off. A deep network may contain millions—or even billions—of adjustable numbers. We can inspect every calculation and still struggle to explain exactly why one internal pattern produced the answer **dog**.

The small network we have shown so far was only a sketch. Real deep-learning networks can contain hundreds of layers and vast numbers of units and parameters.

The network opening in front of us now has six layers, with 100 nodes in each layer. That is already enough to look dense, but it is still far smaller than many production networks. Showing every part of one of those networks would make the screen unreadable.

### 5F. Add Deep Learning to the map

Our map now gains another layer. Deep Learning sits inside Machine Learning, and Machine Learning sits inside Artificial Intelligence. Every Deep Learning system is a Machine Learning system, but not every Machine Learning system uses Deep Learning.

The simple spam model we showed was Machine Learning and did not use a neural network. The dog classifier we are examining does use one, so it belongs inside the Deep Learning region.

The dog is solved. The day is not.

## 5. Animation: Explain deep learning and neural networks through the dog attachment.

Start on the main email screen. Keep all four result cards muted. Place a copy of the **DOG DETECTED** card directly over its muted original, then move the copy towards the upper screen at `x = [-8, 8]`, `y = [4.5, 13.5]`. The original card remains muted on the email screen. Reveal **DOG 98%** only later, when the deep-learning model produces its class scores during inference.

When the copied card reaches the upper screen, morph its label into **MACHINE LEARNING**. When the narration introduces deep learning, add the violet **DEEP LEARNING** label beneath it so that the hierarchy remains clear: Deep Learning is a kind of Machine Learning.

Give the core definition its own uncluttered beat:

**DEEP LEARNING IS MACHINE LEARNING USING NEURAL NETWORKS WITH MANY LAYERS**

Light **DL** in the persistent legend, then dock **DL · LAYERED NEURAL NETWORKS** beneath the title.

Create a box labelled **MODEL**. A large stream of animal pictures enters from the left. Every picture carries a visible label, such as **CAT**, **DOG**, or **HORSE**. After the final training picture enters, pulse the box once and change its label to **TRAINED MODEL**. As the narration says “supervised learning,” reveal a smaller **SUPERVISED LEARNING** chip beneath it.

When the narration returns to the plot-price example, show only two parameter chips, `a = 14` and `b = 7`. Do not rebuild the graph. This is a reminder that the earlier model had two adjustable numbers, not a second training demonstration.

As the narration introduces the neural network, draw a compact `2 × 3 × 2` network on the right and place small weight gauges on its connections. Make the training loop explicit rather than changing weights during an ordinary forward pass:

1. A labelled animal picture moves through the network.
2. The network makes a prediction.
3. Compare the prediction with the correct label and show an **ERROR** value.
4. Send a feedback wave backwards through the network.
5. Adjust a few representative weights.
6. Compress several repetitions into a short **PREDICT → ERROR → UPDATE → REPEAT** loop.

This backward wave is a visual explanation of learning, not a literal display of every calculation. During inference, no error wave or weight update should appear.

While the network is training, remove the `a` and `b` chips. Replace them with a small box labelled **PIXELS → NUMBERS**. Animal pictures enter this box, and a compact vector emerges. The vector contracts to fit the network's input layer, then signals travel forward through the network. This avoids implying that a separate embedding model is required before the image network.

After the training loop stops, remove the **PIXELS → NUMBERS** box and temporarily hide the weight gauges. Move the neural network towards the centre. Let the first and last layers drift apart and label them **INPUT LAYER** and **OUTPUT LAYER**. Draw several hidden layers between them using rounded rectangles and dots for nodes. Place an ellipsis between the two innermost hidden layers to indicate that many additional layers may exist.

After the idea of depth is clear, remove the extra hidden layers. Return the diagram to the compact `2 × 3 × 2` network and move it slightly to the left.

Briefly transform the layers into the simplified feature sequence:

**PIXELS → EDGES → TEXTURES AND SHAPES → DOG**

Keep a small qualifier on screen: **ONE SIMPLIFIED FEATURE HIERARCHY**. Then return to the network view.

On the right, draw and animate the biological neuron available in Veena. Highlight one artificial node and a few of its connections in the network. Temporarily recolour them to match the biological neuron, and send signals through only that small path. This creates the visual analogy without suggesting that the artificial network is a literal brain.

Revert the temporary colours and bring back the weight gauges. When the narration discusses weights, copy a few representative gauge values towards the right and collect them inside a box labelled **WEIGHTS**. Keep the original values on the network so that the connections do not appear to lose their weights.

For inference, reuse the trained network rather than creating a different one. Lock every weight gauge and add a small **WEIGHTS FIXED** indicator. Bring the **PIXELS → NUMBERS** box back. A new dog picture enters from the left and passes through it. Its vector enters the network, signals travel forward once, and an output vector emerges on the right. Pass that vector through a compact **CLASS SCORES** box, then resolve the result as **DOG 98%**. Do not adjust any weight during this sequence.

Hold **DOG 98%** through the lines about larger datasets, faster chips, and the interpretability trade-off. Stay on the compact network for “So far, we have shown a very simple neural network.” On “the network you are seeing now has six layers and 100 nodes per layer,” transition into the animation generated by `/Users/ravishankar/personal-work/animation/private-animations/kavriq-long/what-ai-ai-ml/rust-scripts/src/bin/deep_network_flythrough.rs`.

#### Add Deep Learning to the master diagram

As the fly-through ends, compress the network into a violet card labelled **DEEP LEARNING**. Zoom out to reveal the upper explainer screen, the main email screen below it, and the master AI diagram on the screen immediately to the right of the email at `x = [8, 24]`, `y = [-4.5, 4.5]`.

Move the **DEEP LEARNING** card diagonally down and to the right into the existing green **MACHINE LEARNING** region. As it enters, expand it into a smaller violet region that sits entirely inside Machine Learning. Keep the nesting unmistakable:

- **ARTIFICIAL INTELLIGENCE** is the outer region.
- **MACHINE LEARNING** is the green region inside AI.
- **DEEP LEARNING** is the violet region inside Machine Learning.

Move **DOG 98%** into the violet Deep Learning region. Keep **SPAM 96%** in the green Machine Learning region but outside Deep Learning, because the earlier spam model did not need to be a neural network. Keep **FLAGGED** in the larger AI region but outside Machine Learning.

Zoom into the master diagram and pulse the three nested regions from the outside inward: **AI → MACHINE LEARNING → DEEP LEARNING**. On the line “not every Machine Learning system uses Deep Learning,” briefly pulse the green area that remains outside the violet region. Finish by highlighting **DOG 98%** inside Deep Learning.

On “The dog is solved. The day is not,” pulse **DOG 98%** and the parked **TUE → WED** chip. Hold that frame for the next segment.

## 6. Explain generative AI through the drafted response and token-by-token generation.

Since the end of 2022, AI has dominated news around the world like never before. The reason is not spam detection or image classification. AI has been doing these things, along with some other cool stuff, for quite some time.

But the hype has largely come from AI's ability to chat with us, generating text and code that look as though they might have been created by humans.

This ability to generate content—whether text, code, images, audio, or video—is called Generative AI.

**Generative AI creates a new output instead of only choosing a label or producing a score.** Our spam model selected a label. Our dog classifier selected a class. But the system that drafted the reply created a new sequence of text.

How did it write that sequence?

Start with the instruction: **Draft a polite reply.** The model receives the instruction and the email as context. It does not produce the entire reply at once. It predicts one token, appends it to the growing text, and then predicts the next token.

It may begin with **See**, then **you**. At the date position, several tokens are possible. In this simplified example, **Wednesday** receives the highest score, so the model appends it — even though the source email says **Tuesday**. A score is still only a probability. Real systems often sample from several candidates rather than always taking the top one. Either way, the model then continues with **at 10:00** until the response is complete.

This resembles phone autocomplete continuing one suggestion after another, except the model is much larger and uses the entire growing context each time.

A token is a piece of text. It can be a complete word, part of a word, punctuation, or another small text unit.

And new does not mean created from nothing. The model learned patterns from its training data. The exact reply is new; the language patterns that shaped it were learned during training.

Modern generative AI systems are much more advanced than this, and I have intentionally skipped some very important steps, such as self-attention. The top-score choice above is only a classroom version of decoding. The core is still the same: one token, then the next.

Now, the process in which AI keeps predicting the next token involves many mathematical calculations, and this phase is called inference. To put things into perspective, several orders of magnitude more computation happens during training.

The tokens are represented using arrays of numbers, which we can call vectors. The model performs many mathematical operations—including matrix multiplications—on those vectors. That is broadly how text becomes numerical computation. We will cover the detailed mechanism in a separate video.

The reply sounds fluent because the weights already hold patterns learned during training. Fluent is not the same as checked. Wednesday is still sitting in the draft.

Computer systems generated content before modern deep neural networks existed. So Generative AI is not defined by one specific architecture. It is defined by the capability to create new output.

Most modern Generative AI products do use deep neural networks. Therefore, in our map, Generative AI **overlaps** with Deep Learning. Most of the rose region sits inside Deep Learning, while a smaller portion extends beyond it—but remains inside Artificial Intelligence.

### 6. Generative AI animation

Begin with Veena's existing newspaper-montage components, `Newspaper` and `NewspaperOpening` from `veena/storytelling`. Configure the montage with headlines about the recent rise of AI rather than rebuilding the effect manually. The final newspaper should mention AI chat or generated content so that the montage leads naturally into the narration about why the current wave of AI attracted so much attention.

Play the montage under the opening sentences about the news since 2022. Do not cut to a camera. Keep the Kavriq logo animation in the top-right corner.

When the narration defines Generative AI and returns to the drafted reply, clear the montage and reveal the main email screen at `x = [-8, 8]`, `y = [-4.5, 4.5]`. Keep the existing **TUE → WED** chip in its corner. Indicate the drafted-response card without moving the original card. Create a copy directly over it and move the copy to the upper explainer screen at `x = [-8, 8]`, `y = [4.5, 13.5]`.

As the copied card reaches the upper screen, write **GENERATIVE AI** at the top in the established rose colour. Briefly show the takeaway beneath it:

**CREATES A NEW OUTPUT · NOT ONLY A LABEL OR SCORE**

Hold this statement on an uncluttered screen before beginning the mechanism animation. Light **GenAI** in the persistent legend, then dock **GENAI · CREATES NEW OUTPUT** beneath the title.

Create a large square model box in the centre. Fill it with a dense grid of approximately 100 narrow parameter gauges {10 by 10 grid} so that it visually connects to the weights introduced in Segment 5. The individual values do not need to be readable, but the needle movement needs to be visible. Use the meter gauge available in Veena for this animation. Add a small **WEIGHTS FIXED** indicator to make it clear that the model is no longer training.

Place the instruction and the email context above the model:

**DRAFT A POLITE REPLY**

Keep the source sentence **The meeting is Tuesday at 10:00.** visibly attached to that context. Create a separate answer line below the model; do not append generated tokens to the instruction or source email.

Copy the instruction and email context into the model. Signals travel through the gauge grid, after which a small row of candidate-token cards appears beside the model. Give each candidate a simple score. Highlight the selected token, move it onto the answer line, and then feed the growing answer back into the model together with the original context.

Repeat the same uninterrupted loop:

**CONTEXT → MODEL → NEXT TOKEN → APPEND → UPDATED CONTEXT**

Generate **See → you → Wednesday → at → 10:00**. At the date position, show at least **Tuesday**, **Wednesday**, and **Thursday** as candidates. Draw a visible influence from the source word **Tuesday** into the candidate scores, but still let **Wednesday** receive the highest score and win. Label this choice **SIMPLIFIED: TOP SCORE WINS**. The narration names sampling. Do not animate a second sampling pass. This must communicate that the source was part of the context; prediction simply failed to verify it.

Keep the already generated text visible and use the Generative AI rose colour only for the token currently being added. Once a token settles into the answer, return it to the normal text colour. Turn **Wednesday** to warning `#FF6B5F` after it settles, not the Generative AI accent `#FF5FA2`. The animation should remain continuous; do not pause between a token leaving the model and the updated context entering it.

When the complete answer has been generated, hold it briefly. Keep a simplified version of the loop visible:

**PROMPT → MODEL → NEXT TOKEN → APPEND → REPEAT**

During the sentence that skips self-attention, keep this background completely static. Do not cut to a camera. As the narration reaches “The core is still the same,” pulse the simplified loop once.

When the narration introduces inference, restore the full animation and draw a frame around the prompt, fixed-weight model, candidate selection, and growing answer. Label the frame **INFERENCE**.

Run one more token through the loop. Keep every parameter gauge locked while signals pass through the model. This should show that inference uses the trained weights but does not adjust them.

For the comparison with training, divide the upper screen temporarily into two unequal panels. In the smaller panel, show a compact callback to training: a large stream of examples enters a model while its weight gauges keep changing. Label it **ONE TRAINING RUN**. In the larger panel, preserve the current prompt and token loop with fixed gauges. Label it **ONE GENERATED RESPONSE**.

Use the relative density of motion to communicate the difference in computation. The training side should contain a much larger stream of examples and adjustments. Do not represent this with a precise numerical ratio. After the comparison lands, remove the training panel and return the inference animation to the full upper screen.

When the narration defines tokens, take a short portion of the generated reply and separate it into token cards. Include examples of a complete word, part of a word, and punctuation. Move those cards into a **TOKEN IDs** strip, then transform the IDs into compact numerical vectors.

Send the vectors through a matrix grid. Animate rows and columns lighting up in sequence to suggest matrix multiplication without showing a full equation. Keep this beat brief and schematic; its purpose is to establish that the text becomes numbers and numerical operations, not to teach the detailed mathematics.

For **“New does not mean created from nothing,”** and for the line that fluent is not the same as checked, keep the completed reply visible while abstract training-pattern fragments appear behind it. Language structure, factual associations, and writing style may flicker as echoes around the weights. They are not files retrieved from a database. Do not animate a copied source sentence turning directly into the reply, and do not run another training demonstration. Land the concise contrast:

**NEW SEQUENCE · LEARNED PATTERNS**

Keep **Wednesday** in warning `#FF6B5F` so fluency and the wrong day are on screen together.

End by zooming out to the master diagram on the screen immediately to the right of the email at `x = [8, 24]`, `y = [-4.5, 4.5]`. Add a solid rose **GENERATIVE AI** region that overlaps part of the violet **DEEP LEARNING** region. Keep most of the rose region within Deep Learning, but retain a smaller rose-only extension outside Deep Learning and inside the outer Artificial Intelligence region. Use the established deep-purple intersection colour rather than transparency.

Move the drafted-response card into the Generative AI region. Keep the **TUE → WED** chip visible for the later hallucination discussion. Hold the completed diagram without introducing Foundation Models or LLMs yet; those belong to the next segment.


## 7. Foundation Models, LLMs, and One Model Supporting Several Jobs

Until now, we have looked at the different jobs performed on this email one at a time.

But does every job require a completely separate model?

Not necessarily.

A model can be trained on a broad and diverse collection of data rather than being trained for only one narrow task. Much of that training is self-supervised: the signal comes from the data itself, not from a human label on every example. That model can then serve as a shared starting point for many different jobs.

**One broadly trained model can support many jobs.**

Such a model is called a **foundation model**.

For example, the same foundation model could summarise this email thread, classify its urgency, extract the meeting date, translate the message, or draft a response.

The underlying model is shared. What changes is the instruction we give it—and, in some systems, additional task-specific training, tools, or data.

This does not mean that the entire email application is one model. The complete system may still combine the model with rules, search, external tools, safety checks, and other software.

The model working with language in our example is a **large language model**, or **LLM**.

A large language model learns patterns in language from an enormous amount of text. When it generates text, it produces one token at a time, using the growing context to predict what should come next.

Many modern LLMs serve as foundation models because the same underlying model can be reused across many language-related jobs.

However, the two terms do not mean exactly the same thing.

**Foundation model** describes a broadly trained model that can be adapted or reused for many tasks.

**LLM** describes a model designed to work with language.

And **Generative AI** describes the capability to create a new output.

So, in our example, a foundation model is the shared base, the LLM is the language model, and Generative AI is the capability that produced the drafted reply.

Applications such as ChatGPT are built around models like these. The application and the model are not the same thing.

Foundation models are not limited to language. A **multimodal model** can work across multiple kinds of data—for example, text and images, or audio and video.

That could allow the same model to read the email, inspect its attachment, and help draft the response.

But remember: more capabilities do not automatically make a model more accurate.

Our model could perform several jobs—and it still changed Tuesday to Wednesday.

**More skills did not make it more truthful.**


### 7. Foundation Models and LLMs Animation

Begin on the completed master diagram at `x = [8, 24]`, `y = [-4.5, 4.5]`, exactly where Segment 6 ended. Hold it briefly so that the transition feels continuous. Keep the **TUE → WED** chip visible in the top-right corner, and keep the Kavriq logo animation in its established position.

As the narration says that we have examined the email jobs one at a time, briefly indicate the four existing examples in sequence: the rule-based warning, spam score, dog detection, and drafted reply. Do not move or replay them.

When the narration asks whether every job requires a separate model, pull the camera back toward the main email screen at `x = [-8, 8]`, `y = [-4.5, 4.5]`. Arrange five small empty job slots around the email, suggesting five separate systems. On **“Not necessarily,”** let those empty slots converge into one temporary placeholder and move the placeholder to the upper explainer screen at `x = [-8, 8]`, `y = [4.5, 13.5]`.

On the upper screen, create one solid orange model block using the established Foundation Model colour, `#9A5A20`, with an orange accent of `#FF9F43`. Give it a dark shadow or narrow background gutter so that it remains distinct from any violet Deep Learning elements. Label it:

**FOUNDATION MODEL**

Before revealing its jobs, show several broad data-source ribbons converging on the block: **TEXT**, **IMAGES**, **DOCUMENTS**, **CODE**, and **AUDIO**. These should represent broad training data. On the self-supervised line, add a small chip: **SIGNAL FROM THE DATA ITSELF**. Let the streams adjust a dense field of parameter gauges inside the block, then remove the data streams and lock the gauges. Do not make the animation look like the model is searching those sources during inference.

Clear the surrounding detail and give the orange takeaway one clean, uncluttered beat:

**ONE BROADLY TRAINED MODEL CAN SUPPORT MANY JOBS**

Finish the sentence before any branches begin moving. Light **Foundation Model** in the persistent legend, then dock a shorter label beneath the model:

**FOUNDATION MODEL · SHARED BASE**

Bring a compact copy of the same email onto the left side of the upper screen. Draw one connection from the email into the orange model. From the model, open five orange branches one after another:

- **SUMMARIZE THE THREAD**
- **CLASSIFY URGENCY**
- **EXTRACT THE MEETING DATE**
- **TRANSLATE**
- **DRAFT A REPLY**

Each branch should produce a small, concrete result rather than stopping at a task label. Show a three-line summary, a **HIGH PRIORITY** chip, a **TUESDAY** date card, a short translated sentence, and the existing drafted reply. Keep the model and connecting branches orange. Keep the drafted reply and any newly generated tokens in the established Generative AI rose colour. The model and its output must remain visually distinct.

For the sentence about instructions and task-specific adaptation, keep the orange model fixed while small instruction cards swap above it. Use labels such as **SUMMARIZE**, **EXTRACT DATE**, and **DRAFT REPLY**. Briefly dock a secondary chip reading **PROMPT · TOOLS · TASK ADAPTATION**. The animation should communicate that the shared base remains the same while the requested job changes; it should not imply that every prompt retrains the model.

When the narration explains that the entire application is not one model, zoom out and place the orange model inside a larger neutral application frame. Arrange smaller components around it: **RULES**, **SEARCH**, **TOOLS**, **SAFETY CHECKS**, and **OTHER SOFTWARE**. Connect these components to the application flow without recolouring the orange model. After the distinction lands, collapse the surrounding application frame and return focus to the model.

For the LLM introduction, zoom into the orange block and add a clear badge:

**LARGE LANGUAGE MODEL · LLM**

Light **LLM** in the persistent legend when the badge appears.

Give the LLM takeaway its own clean beat:

**LANGUAGE · TOKEN BY TOKEN**

Use only a short callback to Segment 6. Send a small language instruction into the model and reveal three or four rose reply tokens sequentially on the output side. Do not replay the complete email response or the full inference loop. Keep the model orange and the generated tokens rose.

When the narration distinguishes the terms, replace the detailed model view with four compact comparison cards. Reveal one card with each sentence:

- **GENERATIVE AI** — **CAPABILITY: CREATES NEW OUTPUT**
- **FOUNDATION MODEL** — **SHARED BASE: REUSED ACROSS TASKS**
- **LLM** — **MODEL: WORKS WITH LANGUAGE**
- **APPLICATION** — **PRODUCT BUILT AROUND MODELS**

Use the established concept colours on the first three cards. Keep the Application card neutral. Avoid presenting these as four nested regions; they answer different questions and are not interchangeable categories.

For the reference to ChatGPT, place a generic chat-application window around the orange model card, along with the rules, tools, and safety components. Label the outer window **CHAT APPLICATION** and the inner orange card **MODEL**. Do not use a product logo; the purpose is to distinguish an application from the model that powers it.

For the multimodal explanation, return to the orange model. Send a text card and an image thumbnail into it together, then add a compact badge:

**MULTIMODAL · TEXT + IMAGE**

Briefly show optional, dimmer **AUDIO** and **VIDEO** inputs behind them. Use the email and its dog attachment as the active text-and-image example. Let the same model produce a small description of the attachment and a draft-response token, showing that one model can work across more than one kind of data.

End by returning to the main email with the five job branches still connected to the same orange foundation-model block. Keep the correct **TUESDAY** extraction visible beside the drafted response that says **WEDNESDAY**. Then pulse the persistent **TUE → WED** chip once.

As the narration says, **“More skills did not make it more truthful,”** dim the five successful job branches without removing them and give the incorrect date the full warning accent. Add the final bridge:

**MANY SKILLS ≠ GUARANTEED TRUTH**

Finally, move the orange **FOUNDATION MODEL / LLM** card into the violet Deep Learning region of the right-hand master diagram. Place it beside the rose drafted-response card and connect the orange model to the rose output with an arrow labelled **GENERATES**. Treat this as a concrete example of a modern deep-learning-based foundation model, not as a new universal map region. Hold the diagram with the **TUE → WED** chip still visible so that Segment 8 can begin directly with hallucinations, bias, privacy, synthetic media, and verification.


## 8. When Prediction Goes Wrong

Our email clearly says that the meeting is on Tuesday. But the model confidently drafted a reply saying Wednesday.

A plausible-sounding but incorrect statement generated by an AI system like this is called a **hallucination**.

Why does this happen?

Many machine-learning systems work through prediction. A generative model repeatedly predicts what should come next. In the simplified demo, Wednesday had the highest score, so it was appended. That score was still only a probability, not a certainty. Real systems often sample from several candidates. Either way, the model produces a likely continuation. It does not automatically verify that continuation against the source.

In our example, Wednesday won that simplified choice even though the original email said **Tuesday**.

The model was not necessarily trying to deceive us. It generated a statistically plausible answer that happened to be wrong.

This is the difference between prediction and verification. Prediction asks, “What is likely to come next?” Verification asks, “What does the evidence actually support?”

Giving a model access to trusted sources and tools — such as the original email, a calendar, or a verified document — can reduce hallucinations. But it does not guarantee that every answer will be correct. Never give the system more access than the check requires.

So, before we use this reply, let's verify it against the source and correct **Wednesday** back to **Tuesday**.

Hallucinations are not the only risk.

A model can also reproduce or amplify patterns of **bias** found in its training data. That is why important outputs and decisions need to be checked and audited.

We must also protect **private data**. Sensitive information should not be entered into an AI system unless we understand how that system stores and uses it.

Generative AI can create realistic images, audio, and video. Not every piece of synthetic media is a deepfake. The term **deepfake** is generally used when synthetic media convincingly imitates a real person or event. If media is synthetically generated, we should disclose it clearly.

Finally, a model that performs well on one task may still fail on another. We must test it on the actual job we need it to perform.

So, remember these five actions: **verify facts, audit for bias, protect private data, disclose synthetic media, and test the system on the work you actually need.**

And when a mistake could seriously affect someone, keep a person in the loop.

**Use AI for speed. Keep verification for trust.**


### 8. Animation - Hallucinations, Risks, and Verification Animation

Begin on the completed right-hand master diagram at `x = [8, 24]`, `y = [-4.5, 4.5]`, exactly where Segment 7 ended. Keep the orange **FOUNDATION MODEL / LLM** card inside the violet Deep Learning region, the rose drafted-response card inside Generative AI, and the **TUE → WED** chip visible in the top-right corner. Keep the Kavriq logo animation in its established position.

Pulse the **TUE → WED** chip once, then move the camera back to the main email screen at `x = [-8, 8]`, `y = [-4.5, 4.5]`. Keep the email visible and place two large date cards beside it:

- **SOURCE EMAIL · TUESDAY**
- **DRAFT REPLY · WEDNESDAY**

Draw a clear mismatch line between the two cards. Use warning `#FF6B5F` only on **WEDNESDAY**. Introduce the word **HALLUCINATION** above the mismatch and give the definition one uncluttered visual beat:

**PLAUSIBLE-SOUNDING · BUT INCORRECT**

When the narration asks why this happens, move to the upper explainer screen at `x = [-8, 8]`, `y = [4.5, 13.5]`. Show a compact callback to Segment 6: the original email and the growing reply enter a fixed model, and several candidate-token cards appear on the output side. Give **WEDNESDAY** the highest score, keep the label **SIMPLIFIED: TOP SCORE WINS**, and move it into the reply.

Do not replay the full inference sequence. Keep this callback short and focus attention on two contrasting labels:

**PREDICTION · WHAT IS LIKELY TO COME NEXT**

**VERIFICATION · WHAT THE EVIDENCE SUPPORTS**

For the sentence explaining that the model is not necessarily trying to deceive us, avoid character animation or human facial expressions. Keep the model visually mechanical. Add a small label beneath it:

**LIKELY ≠ TRUE**

Next, create a verification path beside the generation path. Let the generated **WEDNESDAY** token travel back to three trusted-source cards: **ORIGINAL EMAIL**, **CALENDAR**, and **VERIFIED DOCUMENT**. The original-email card lights up and returns **TUESDAY**. Mark the mismatch clearly, but do not imply that the model automatically performs this check unless it has been connected to these sources or tools.

Show the mitigation pipeline:

**GENERATE → CHECK SOURCE → CORRECT**

On “never give the system more access than the check requires,” put those three source cards behind a gate labelled **ONLY THE ACCESS THE CHECK NEEDS**. Do not open a general connection from the model to private data.

Return to the main email. Replace **Wednesday** with **Tuesday** inside the drafted reply so that the viewer sees the correction happen. Transform the corner chip from **TUE → WED** into:

**WED → TUE ✓**

Keep this corrected chip visible until Segment 9 clears it.

After the correction, keep the email dimly visible in the background. The hallucination has already been shown, so do not replay it as a full scene. Land its action from the corrected date:

**HALLUCINATION → VERIFY FACTS**

Then give bias its own picture. An uneven set of training examples enters a simple decision scale. The scale becomes visibly unbalanced before the action lands:

**BIAS → AUDIT AND CHECK**

Keep this schematic. Do not imply that bias can always be removed with one adjustment.

Bring the other three actions in as one row, each with a single icon:

- **PRIVATE DATA → PROTECT** — a card reading **NAME**, **PHONE**, and **ACCOUNT NUMBER** stops behind a lock. No realistic personal information.
- **SYNTHETIC MEDIA → DISCLOSE** — a generic avatar and a short waveform, with the imitation labelled **DEEPFAKE**. Synthetic media is the broad category. A deepfake is the convincing imitation of a real person or event. Do not label every generated image, audio clip, or video as a deepfake.
- **THE JOB YOU NEED → TEST** — three small test chips, two passing and one failing. Performance on one example does not guarantee another job.

Collect the five actions into one bold row:

**VERIFY · AUDIT · PROTECT · DISCLOSE · TEST**

Then place a neutral human-review gate after the AI output:

**AI OUTPUT → HUMAN REVIEW → ACTION**

When the narration says to keep a person in the loop, require the human-review gate to approve the output before the final action card lights up. Keep the interaction professional and schematic rather than representing a person merely watching the model.

Finish on the corrected email with **Tuesday** highlighted. Keep the **WED → TUE ✓** chip in the corner and show the final takeaway on an uncluttered screen:

**USE AI FOR SPEED**

**KEEP VERIFICATION FOR TRUST**

Return to the completed master diagram without adding any new taxonomy region. The risk cards are operational concerns, not additional categories of AI. Keep the corrected drafted-response card ready for Segment 9, where the four email results and all major terms will be summarised on the final concept map.


## 9. Summary: Putting Everything Together

Let's return to our map and put everything together.

**Artificial Intelligence** is the broad goal. Learning is optional. The checklist that flagged our email used rule-based AI: it followed human-written instructions but never learned from data.

**Machine Learning** is one way to build AI. It learns patterns from examples and uses them to make predictions on new data. That produced our 96 percent spam score.

**Deep Learning** is Machine Learning using neural networks with many layers. That is how our system recognised the dog in the attachment.

**Generative AI** creates a new output instead of only choosing a label or producing a score. It generated our drafted reply.

A **foundation model** is a broadly trained, reusable base. One foundation model can support tasks such as summarising, classifying, extracting information, translating, and drafting.

An **LLM** is a model designed to work with language. When a generative LLM produces text, it generates one token at a time.

The model is not the complete application. A real AI application may combine models with rules, search, tools, safety checks, and other software.

And **Data Science** uses data to understand problems and guide decisions. It overlaps with Machine Learning, and it can use Machine Learning as one of its tools, but the two are not the same thing.

The final map shows these relationships. AI contains Machine Learning, and Machine Learning contains Deep Learning. Generative AI overlaps with Deep Learning because most modern generative systems use deep neural networks, although Generative AI is defined by what it creates, not by one specific architecture. Data Science overlaps with Machine Learning and also extends beyond AI.

The orange Foundation Model and LLM card is a concrete model inside the diagram, not another universal region. It generated the rose reply, which is the output—not the model itself.

Four results. One email. Different mechanisms.

Sometimes these results come from separate systems. Sometimes one foundation model handles several learned jobs inside a larger system that still includes rules and tools.

And fluent does not mean verified. Our reply became useful only after we checked Wednesday against the original email and corrected it back to Tuesday.

If this explanation helped you separate these terms, subscribe for more visual breakdowns of AI, software, and technology.

What should we open next: how training changes the weights, attention, or how a model is tested?

### 9. Summary animation

Begin on the master diagram at `x = [8, 24]`, `y = [-4.5, 4.5]`, with the regions already built:

- **ARTIFICIAL INTELLIGENCE**, `#17647D`, contains everything except the part of Data Science that extends past it.
- **MACHINE LEARNING**, `#1E7A55`, sits inside AI.
- **DEEP LEARNING**, `#53368A`, sits inside Machine Learning.
- **GENERATIVE AI**, `#C4485C`, overlaps part of Deep Learning. Most of the rose region stays inside Deep Learning. A smaller rose portion stays outside Deep Learning and inside AI. Their overlap uses `#35194F`, not transparency.
- The orange **FOUNDATION MODEL / LLM** card, `#9A5A20`, sits inside Deep Learning. An arrow labelled **GENERATES** runs to the rose reply. The reply is output. Do not draw the orange colour around the reply.

As each definition is spoken, pulse only the region or card it names. Do not build a second diagram.

On the Data Science sentence, add the missing region. Draw a solid slate shape, `#677585`, that overlaps part of the green Machine Learning region and crosses outside the cyan AI boundary. Fill the overlap with `#123744`. Leave a 4–6 px `#070A16` gutter where the slate meets neighbouring regions. Neither field contains the other. Label the slate-only area **DATA SCIENCE** and the overlap **MACHINE LEARNING AS A TOOL**. This is the same relationship as the side-screen comparison in Segment 4, now placed on the master map.

Place the four results in the regions they already earned:

- **FLAGGED** in AI, outside Machine Learning.
- **SPAM 96%** in Machine Learning, outside Deep Learning.
- **DOG 98%** in Deep Learning.
- The corrected draft, now reading **See you Tuesday at 10:00.**, in the rose Generative AI region.

On “sometimes separate systems, sometimes one foundation model,” first show the four results on four dim separate cards, then return them to the single orange model’s branches. Keep **FLAGGED** on the rule card either way, so the checklist is not implied to be a learned model.

Clear the **WED → TUE ✓** chip only after the correction line. It is not part of the final map. End on the map, then the subscribe line. The sequel question offers how training changes the weights, attention, or how a model is tested. Do not offer model training, neural networks, or large language models as if this video had not opened them.
