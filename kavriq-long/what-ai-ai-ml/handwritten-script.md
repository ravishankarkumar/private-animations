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

This one email puts four different AI systems to work.

The first one flags the warning signs.  
The second one gives it a 96 percent spam score.  
The third one recognises the dog in the attachment.  
And the fourth one writes this draft reply.

But look closely. The email says **Tuesday**, and the draft confidently says **Wednesday**.

Inside this one email are several terms people often mix up. They are related, but they are not interchangeable. Let's separate them by opening each result.



### 1. Introduction - Animation

Open on the envelope. It opens within the first few seconds, and the email card moves to centre stage. Do not open on a newspaper montage, and do not begin with a spoken list of terminology. Newspapers belong to the generative-AI section. The muted legend may show the terms. The narration does not read them yet.

The email card uses the neutral panel `#141C32` and contains only these readable fields:

- Sender: `unknown.sender@fast-confirm.net`
- Subject: `URGENT: Meeting moved`
- Body: `The meeting is Tuesday at 10:00.`
- Link: `Confirm meeting`
- Attachment: `dog-photo.jpg`
- Draft reply: `See you Wednesday at 10:00.`

The message never contains the word spam. The sender line, the urgent subject, and the confirmation link are the evidence for the checklist and the spam score. The Tuesday sentence and the dog attachment stay unconnected to those two results.

As each result is described, its card appears. Two cards sit above the email and two sit below it. Draw the result connectors as the cards appear, and keep them for the rest of the video. They keep tracking the email and their cards on every frame:

- **FLAGGED** is fed by three arrows, one from the sender, one from the subject, and one from the link.
- **SPAM 96%** has one arrow from those same message fields.
- **DOG 98%** has one arrow from the attachment.
- The draft card has one arrow from the reply.

When the Tuesday-to-Wednesday error is mentioned, the **TUE → WED** pill shifts to the top-right corner. Use warning `#FF6B5F` for that pill, not the Generative AI rose.

At the same time, introduce the muted persistent terminology legend in the opposite corner, in teaching order: **AI · ML · Data Science · DL · GenAI · Foundation Model · LLM**. Keep both the legend and the error pill fixed during later camera moves.

## 2. Explain rule-based AI through the email-warning checklist.

Let's look at the system that flagged this email as suspicious. It checked a few hard-coded rules, such as:

- Unknown sender.
- Urgent wording.
- Suspicious link.

And it decided that the email was suspicious.

There is no learning involved, yet the system can identify a suspicious message. This is also AI. AI refers to systems that perform tasks we generally associate with intelligence.

**AI is the broad goal. Learning is optional.**

A classical chess program that uses hand-designed search, or a loan-eligibility expert system, is also AI. Neither one learns. Systems like these existed for decades before a model learned from examples.

-> Real camera footage with my face

This kind of system has one flaw. Once spammers learn which signals you use to flag them, they will avoid those signals, and the flagging system becomes ineffective.

For this reason, a system that can learn becomes important.

-> Return of animation

We will keep this diagram and add to it as the other results open.

### 2. Animation

This screen begins where the introduction finished. The result connectors are already tracking the email.

Within the first second, the screen rearranges itself. Two smaller cards move to the top, and the other two move to the bottom.

The email card becomes smaller and shifts toward the left.

All these changes happen simultaneously.

Then, the **FLAGGED** card is highlighted while the other three cards dim. A copy of the **FLAGGED** card is created in exactly the same position. The copy moves into the empty space on the upper-right, while the original card remains dimmed.

Retarget the three existing flagged arrows onto the copied card. Do not draw a second set. Below it, write three items one by one:

- Unknown sender.
- Urgent wording.
- Suspicious link.

This checklist, the definition, and the examples all happen before the camera. On the definition, zoom out and move the copied card onto the right-hand diagram screen at `x = [8, 24]`, `y = [-4.5, 4.5]`. Expand it into the solid Artificial Intelligence region, `#17647D`, and place **AI** near its top edge. Leave **FLAGGED** inside that region. Leave **SPAM 96%**, **DOG 98%**, and the draft outside it.

Give the takeaway one uncluttered beat before the examples:

**AI IS THE BROAD GOAL · LEARNING IS OPTIONAL**

Light **AI** in the persistent legend. Then shorten the docked section label to **AI · BROAD GOAL** and show:

- **CLASSICAL CHESS SEARCH**
- **LOAN ELIGIBILITY RULES**

Hold this diagram completely still through the live camera footage. The footage covers only the brittleness of the fixed signals. When the animation returns, do not redraw the region or replay the takeaway. The diagram stays up so the next section can add to it.


## 3. Explain machine learning through the spam score, training, and inference.

Now, back to the learning part. A system that can learn may overcome some of these limitations. Machine learning is one way—in fact, one of the most important ways—to build AI. Machine learning means that a machine learns patterns from examples and data.

In our email example, the system that marked this email as spam learned from a large number of emails that had already been labelled as spam or not spam.

But what does it actually mean to learn from past examples and use that learning? Is it magic? No. It is mathematics.

A simple machine-learning system works in two phases. The first phase is learning, which we call training.

The second phase is using what it has learned, which we call inference.

We used a previously trained model to predict that our email is spam. This is called inference.

Let's say you have a CSV file containing data about plot prices in Muzaffarpur, a city in Bihar. We can plot those examples on a graph.

Can you guess the price of a 4,000-square-foot plot? Around ₹60 lakh, or ₹6 million, right? You probably predicted it using intuition.

Now, let's see how a machine-learning model can be trained on this data.

Let's begin with a line represented by the equation `y = ax + b`. If we adjust this line to minimise the overall error, we may get an approximate equation that can predict plot prices. With size measured in thousands of square feet and price in lakh rupees, one such line is `y = 14x + 7`.

Putting 4,000 into this equation gives `14 × 4 + 7`, which is ₹63 lakh. That is close to the guess of about ₹60 lakh. So, we have used machine learning to make a prediction.

The equation `y = ax + b` is the model in this example. Fitting it was training. Reading ₹63 lakh from the locked line was inference. These are the same two phases as the spam score.

People still choose the examples, the objective, and how the system will be tested. The model does not invent its own job.

And Machine Learning does not automatically mean a neural network. Our spam model only scored the message fields. It did not inspect the attachment, and it did not write the reply.



Machine learning is a part of AI: it is one way to build systems that learn patterns from examples.



### Machine learning animation

This segment uses three persistent screens:

- **Main email screen:** `x = [-8, 8]`, `y = [-4.5, 4.5]`.
- **AI diagram screen:** `x = [8, 24]`, `y = [-4.5, 4.5]`.
- **Machine Learning explainer screen:** `x = [-8, 8]`, `y = [4.5, 13.5]`.

The segment begins on the main email screen.

#### Move from the spam result to Machine Learning

The **SPAM 96%** card becomes bright while the other three result cards remain dimmed. Create a copy of the Spam card in exactly the same position. Once the copy separates, the original Spam card dims again.

The camera zooms out while the copied card moves upward into the Machine Learning explainer screen. These actions happen simultaneously, so the audience can see where the new screen is relative to the email screen.

As the copied card crosses into the upper screen, its text changes from **SPAM 96%** to **MACHINE LEARNING**. The card expands slightly and becomes the title card for the new screen. The camera then zooms in and centres on the upper screen at approximately `[0, 9]`.

Give the core takeaway one clean beat before the training mechanism begins:

**MACHINE LEARNING LEARNS PATTERNS FROM EXAMPLES**

Light **ML** in the persistent legend, then keep **ML · LEARNS FROM EXAMPLES** docked beneath the title.

On the main screen below:

- The email remains at full opacity.
- All four original result cards remain in place and dimmed.
- All result connectors remain visible and continue tracking the email and their cards every frame. The flagged connector is still the three evidence arrows.
- The **TUE → WED** chip remains in its established position.

The main email screen is not rebuilt or removed. It remains available below the current camera view so we can return to it later.

Do not add a second definition beneath the title yet. Keep **MACHINE LEARNING** pinned near the top of the upper screen and use the space below it to demonstrate what learning means.

#### Learning from labelled emails

Write **LEARNING** beneath the title. In the centre of the screen, draw a green model box containing a tidy bank of six to eight vertical parameter gauges (meter-gauge is available in murali). The gauges represent adjustable numerical parameters; they should not resemble the three-item checklist from Segment 2.

Miniature email cards enter from the left. Each card is clearly labelled **SPAM** or **NOT SPAM**. Use varied colours and short subject-line fragments so the cards feel like different examples rather than repeated copies:

- **SPAM** — urgent transfer, unknown sender, suspicious link.
- **NOT SPAM** — team update, known sender, ordinary wording.
- **SPAM** — prize notification, suspicious link.
- **NOT SPAM** — project review, known sender.

As each labelled email enters the model, two or three gauges change height. Stagger the adjustments so the box appears to learn gradually from the collection rather than react to one decisive keyword. After the final example enters, change **LEARNING** into:

**TRAINING = LEARNING FROM EXAMPLES**

Hold the trained gauge positions. When the narration asks, “Is it magic?”, briefly dim the surrounding elements and replace the gauge values with compact mathematical symbols. Reveal:

**NOT MAGIC. MATHEMATICS.**

Then restore the gauges without changing their final positions.

#### Contrast training with inference

Keep the model box in place. Move the completed Training statement to the left side of the model and add a small lock icon to the parameter gauges. On the right, reveal:

**INFERENCE = USING A TRAINED MODEL**

Use Machine Learning green for Training and a contrasting cyan for Inference. This colour distinction should remain consistent in later segments.

When the narration says that the previously trained model predicted the current email, bring in one unlabelled email from the left. It passes through the locked model without changing any gauge. A result card emerges on the right and resolves in two beats:

First **SPAM**, then **96%** beneath it.

The essential visual distinction is:

- During **Training**, many labelled examples enter and the parameters move.
- During **Inference**, one new example enters and the trained parameters remain fixed.

Hold both labels for a beat, then clear the email pipeline while leaving the **MACHINE LEARNING** title pinned at the top.

#### Build the plot-price example

This sequence shows the same two phases with the parameters visible. Do not present it as a second kind of machine learning, and do not define training or inference again.

Write **PLOT PRICES IN MUZAFFARPUR** beneath the title. A CSV document appears in the centre with the columns **Plot size (sq ft)** and **Price (₹ lakh)**. Use a small, legible dataset whose fitted line lands near ₹63 lakh for 4,000 square feet, close to a visual guess of ₹60 lakh.

The CSV shifts to the right. On the left, draw a graph with:

- Horizontal axis: **Plot size (sq ft)**.
- Vertical axis: **Price (₹ lakh)**.

Animate the CSV row highlight moving downward. As each row is highlighted, a matching dot travels from the row into its correct position on the graph. The dots should form a clear upward trend but not a perfect line.

#### Show the viewer's intuitive estimate

When the narration asks for the price of a 4,000-square-foot plot, place an amber marker at `4,000` on the x-axis. Draw a dashed vertical guide upward to an estimated point near `60`, followed by a dashed horizontal guide left to the y-axis. Write **₹60 LAKH** beside the y-axis and add a small label:

**YOUR ESTIMATE**

Do not draw a fitted model line yet. This first estimate represents human intuition, not the machine-learning model.

#### Train the line

Before the narration introduces `y = ax + b`, remove only the amber estimate marker and its dashed guides. Keep the axes and all data points visible. Fade the CSV slightly so the graph becomes dominant.

Write `y = ax + b` on the right, with small parameter chips for `a` and `b`. Draw an intentionally poor line across the graph. Add thin residual lines from each data point to the prediction line and a compact **ERROR** meter.

Animate four or five deliberate training steps rather than continuously wobbling the line:

1. The values of `a` and `b` change.
2. The prediction line rotates and shifts.
3. The residual lines become shorter overall.
4. The Error meter decreases.

Briefly pulse the currently changing parameter chip during each adjustment. This visually connects “adjusting the line” with “adjusting the parameters.”

For readable arithmetic, measure `x` in thousands of square feet and `y` in lakh rupees. Settle on the illustrative trained equation:

**`y = 14x + 7`**

At `x = 4`, this produces `y = 63`. Lock the `a` and `b` chips and stamp **TRAINED** beside the final equation. The dataset and final line should make this fit visually plausible, and the line should not pass through the viewer's earlier ₹60 lakh guess.

#### Use the trained model for inference

When the narration says, “Putting 4,000 into this equation,” transform **4,000 sq ft** into **`x = 4` thousand sq ft** beside the equation. Then reveal the substitution step by step:

**`y = 14(4) + 7 = 63`**

At the same time, a cyan guide rises from `4,000` on the x-axis until it meets the fixed trained line, then travels left to the y-axis. Resolve the result as **₹63 LAKH**. The trained line and parameter values must remain fixed throughout this inference beat.

#### Turn the graph into a model

When the narration says, “The equation `y = ax + b` is our model,” fade the CSV and graph furniture while keeping the fitted line and equation visible. Compress them into a compact green card labelled:

Place **MODEL** on the first line and `y = ax + b` directly beneath it.

Place the two locked parameter chips, `a = 14` and `b = 7`, inside the card. Beneath it, label the phases already named on the email demo:

- **TRAINING** — `a` and `b` were adjusted on the examples.
- **INFERENCE** — the locked line produced **₹63 LAKH**.

For Training, briefly replay miniature data dots entering while `a` and `b` adjust. For Inference, lock both parameters and pass **4,000 sq ft** through the model to produce **₹63 lakh**. This is a compact reminder, not a second definition and not a second full demonstration.

#### Add Machine Learning to the AI diagram

Clear the recap elements, leaving only the green **MACHINE LEARNING** title card. Zoom out far enough to reveal the upper ML screen, the original email screen below, and the AI diagram screen to the right.

Move the Machine Learning card diagonally into the AI screen at `x = [8, 24]`, `y = [-4.5, 4.5]`. As it enters the AI box, expand it into a smaller green region labelled **MACHINE LEARNING**. Place **SPAM 96%** inside the ML region. Keep **FLAGGED** inside the larger AI region but outside ML.

The spatial relationship must be immediately readable:

- **FLAGGED** is AI, but it is not Machine Learning.
- **SPAM 96%** is Machine Learning, and Machine Learning sits inside AI.

Zoom into the AI diagram and pulse the ML region once as the narration concludes:

**Machine learning is one way to build AI.**

Hold this composition for the transition into the next segment.



## 4. Briefly compare Data Science with machine learning, and name supervised learning as the type used on this email.

-> Live camera feed

Before we move deeper into Machine Learning, let's briefly compare it with another term we frequently encounter: Data Science.

-> Live camera feed ends here; animation starts

Machine Learning builds systems that learn patterns from data. In our previous example, the system learned from emails labelled as spam or not spam. It then applied those learned patterns to a new email and predicted its spam score.

Data Science, by contrast, can ask broader questions about the data itself. How many spam emails arrive every day? Where do they come from? Is their number increasing? What other patterns can we discover? Should an inbox have another category for important mail, besides spam and not spam?

To answer such questions, a data scientist may collect data, clean it, analyse it, visualise it, and sometimes build a machine-learning model.

So, Data Science and Machine Learning overlap, but they are not the same thing. Data Science can use Machine Learning as one of its tools. At the same time, building useful Machine Learning systems often relies on data-science practices — collecting, cleaning, exploring, and validating data — so that models learn from reliable data and their predictions can be interpreted.

Machine Learning itself can happen in more than one way.

When we train a model using emails that have already been labelled as spam or not spam, that is called **supervised learning**. The model learns from examples for which the correct answer is already known.

A model can also group unlabelled examples, mix a few labels with many unlabelled ones, or learn from a reward after an action. Those are different lessons. Today, remember supervised learning. The spam score was trained that way, and the dog picture will be too.


### 4. ML vs Data Science Animation

This segment continues from Segment 3's final taxonomy frame.

The persistent screens are now:

- **Main email screen:** `x = [-8, 8]`, `y = [-4.5, 4.5]`.
- **Machine Learning explainer screen:** `x = [-8, 8]`, `y = [4.5, 13.5]`.
- **AI diagram screen:** `x = [8, 24]`, `y = [-4.5, 4.5]`.
- **Data Science and learning-types screen:** `x = [24, 40]`, `y = [-4.5, 4.5]`.

During the live-camera section, hold Segment 3's final taxonomy frame completely still, including the Kavriq logo. When the live-camera section ends, zoom out to reveal the adjacent screen at `x = [24, 40]`, `y = [-4.5, 4.5]`, and move the camera into it.

Begin by writing **MACHINE LEARNING vs DATA SCIENCE** near the top of the screen.

Light **Data Science** in the persistent terminology legend when the comparison title appears. Keep **ML** lit. The circles, once they settle, must show an overlap without implying that either field wholly contains the other.

As the questions are spoken, show three slate chips on the Data Science side:

- **HOW MANY PER DAY**
- **WHERE FROM**
- **INCREASING?**

Then draw two solid circles. Label the circle on the left **MACHINE LEARNING**, fill `#1E7A55`, and the circle on the right **DATA SCIENCE**, fill `#677585`. Move them together once and settle them with a solid overlap. Fill that overlap with `#123744`. Do not use transparency, and do not bounce the circles apart.

In the overlap, write **DATA** in bold. Beneath it, reveal the shared practices on separate lines:

- **COLLECT**
- **CLEAN**
- **EXPLORE**
- **VALIDATE**

Also place a chip in the overlap reading **MACHINE LEARNING AS A TOOL**, so both spoken claims are visible: the fields share data practices, and Data Science can use a model as one tool.

From the Machine Learning side, draw an arrow toward the lower-left and write:

**LEARN PATTERNS FROM DATA → PREDICTIONS**

From the Data Science side, draw an arrow toward the lower-right and write:

**FIND INSIGHTS IN DATA → INFORM DECISIONS**

Keep these two statements aligned along the bottom so the distinction can be understood at a glance. Leave this comparison on the side screen. Do not add Data Science to the master diagram yet. The summary places it there, overlapping Machine Learning and extending beyond Artificial Intelligence.

When the narration names supervised learning, dim the Data Science circle and write **SUPERVISED LEARNING** inside the Machine Learning circle. Beneath it, in smaller dim type, list the other ways without walking through each one:

- **UNSUPERVISED**
- **SEMI-SUPERVISED**
- **REINFORCEMENT**

Do not introduce self-supervised learning here. That term arrives with foundation models. Highlight **SUPERVISED LEARNING** and connect it back to the **SPAM 96%** card.


## 5. Explain deep learning and neural networks through the dog attachment.

One of the AI systems that worked on this email looked at the attachment and recognised the dog in the picture. And no prize for guessing that this one is also a machine-learning system.

This system was trained on a large collection of animal pictures. Each training picture was already labelled with the correct animal type, such as cat, dog, or horse. Because we use labelled data to train the model, this is an example of supervised learning.

This is also deep learning. Deep learning is machine learning that uses neural networks with many layers. It is called *deep* because many layers sit between the input and the answer. No other reason.

But how does the training happen?

In the plot-price example, the adjustable numbers were two parameters: `a` and `b`. A neural network contains many more adjustable numbers. Many of them are called weights, and in our simplified diagram, they sit on the connections between units.

A layer is one stage of calculation. The picture passes through one layer, then the next, and then the next. During training, the network's guesses are compared with the correct labels. Based on how far those guesses are from the correct answers, the weights are adjusted slightly. Across many examples, those adjustments help the network make better predictions. The model is not simply storing all the pictures. It is learning patterns that help it predict a label for a new picture.

The layers can learn a hierarchy of useful features. Early layers may respond to simple edges. Later layers can combine those edges into textures and shapes, and deeper layers can assemble that evidence into a prediction such as **dog**. This is a simplified picture—not every network separates the steps so neatly—but it explains why multiple layers can be useful.

In many older Machine Learning systems, people had to decide which features the model should measure. Deep networks can learn many of those useful features directly from the training examples.

Why call the network *neural*? “Neural” is a loose nod to the neurons in a brain. This is not a brain. It is layers of mathematics. Each artificial unit receives numbers from the previous layer, combines them, and passes a new number forward. That number can be zero.

Once training ends, the weights stay fixed. This attachment is a new picture, and it does not come with an answer label. The network makes one forward pass and predicts: dog, 98 percent. It can still be wrong.

Larger datasets, faster chips, and better training methods made these networks increasingly effective. That progress drove major advances in computer vision, speech recognition, and language processing.

There is a trade-off. A deep network may contain millions—or even billions—of adjustable numbers. We can inspect every calculation and still struggle to explain exactly why one internal pattern produced the answer **dog**.

So far, we have shown a very simple neural network. Real deep-learning networks can contain hundreds of layers and vast numbers of units and parameters. Even the network you are seeing now has six layers and 100 nodes per layer. If we tried to show every part of a production-scale network, the screen would quickly become unreadable, so we had to scale back.

Our map now gains another layer. Deep Learning sits inside Machine Learning, and Machine Learning sits inside Artificial Intelligence. Every Deep Learning system is a Machine Learning system, but not every Machine Learning system uses Deep Learning. Our dog classifier belongs in the Deep Learning region.

The dog is solved. The day is not.

## 5. Animation: Explain deep learning and neural networks through the dog attachment.

Start on the main email screen. Keep all four result cards muted. Place a copy of the **DOG 98%** card directly over its muted original, then move the copy towards the upper screen at `x = [-8, 8]`, `y = [4.5, 13.5]`. The original card remains muted on the email screen.

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
