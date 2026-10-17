# Youtube Title
AI vs Machine Learning vs Deep Learning vs Generative AI — Explained with One Practical Example

## Description

AI, machine learning, deep learning, and generative AI are often used interchangeably—but they describe different goals, methods, models, and capabilities.

In this visual explainer, we use one practical example—a suspicious email—to understand how these technologies differ.

The email activates several systems:

- A rule-based AI system flags the warning signs.
- A machine-learning model calculates a 96% spam probability.
- A deep neural network recognizes the dog in the attachment.
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

What should we explain next: model training, neural networks, or large language models?

References and further viewing:

- [IBM Technology: AI, Machine Learning, Deep Learning and Generative AI Explained](https://www.youtube.com/watch?v=qYNweeDHiyU)

#ArtificialIntelligence #MachineLearning #GenerativeAI #deeplearning #neuralnetwork

## Thumbnail idea

[Thumbnail Idea](./thumbnail-idea.md)

## Missing animation cuues can be filled from [here](./what-is-ai-ml-dl-gen-ai.md).
## In the top right corner, a Kavriq bubble animation will keep playing on loop. All through out the video.

## Overall Structure

1. Introduction: Introduce one email, four AI-powered results, and the incorrect Tuesday-to-Wednesday reply.
2. Explain rule-based AI through the email-warning checklist.
3. Explain machine learning through the spam score, training, and inference.
4. Briefly compare Data Science with machine learning and mention the major ML learning types.
5. Explain deep learning and neural networks through the dog attachment.
6. Explain generative AI through the drafted response and token-by-token generation.
7. Introduce foundation models, LLMs, and how one model can support several jobs.
8. Explain hallucinations, deepfakes, bias, privacy, and the need for verification.
9. Summarize everything by placing the email’s four results onto the final concept map.


## 1. Introduction

Let's talk about the differences between AI, machine learning, deep learning, and generative AI—but with a twist. We will make them work on a single email and understand the concepts and their differences through practical applications.

In this hypothetical example, four different AI systems work on the same email.

The first one flags the warning signs.  
The second one gives it a 96 percent spam score.  
The third one recognizes the dog in the attachment.  
And the fourth one writes this draft reply.

By the way, notice that it writes the wrong day. It sees Tuesday and still writes Wednesday.

Hallucinations, right? Let's set that aside for now. We will return to it later.



### 1. Introduction - Animation

First, write **Artificial Intelligence**. On the next line, after some spacing, write **Machine Learning • Deep Learning**. On the following line, write **Generative AI**.

Then, a page-turn animation reveals an envelope. An email card emerges from it and moves to center stage. It contains all the email attributes we decided on.

<!--  -->
Add the required email-format data here.
<!--  -->

As I describe the four results one by one, four cards appear—two at the top and two at the bottom—as described in the animation companion linked above.

When I mention the Tuesday → Wednesday error, the pill shifts to the top-right corner.

## 2. Explain rule-based AI through the email-warning checklist.

Let's look at the system that flagged this email as suspicious. It checked a few hard-coded rules, such as:

- Unknown sender.
- Urgent wording.
- Suspicious link.

And it decided that the email was suspicious.

See, there is no fancy algorithm involved, yet the system can identify a suspicious message. Believe it or not, this is also AI. Now, you may be tempted to ask: what exactly is AI? AI refers to systems that perform tasks we generally associate with intelligence.

So, a chess program or loan-processing software that checks loan eligibility can also be considered AI. And the interesting part is that neither of them needs to use machine learning. These kinds of AI systems have existed for decades.

-> Real camera footage with my face

But this kind of system has one flaw. If the rules of chess change tomorrow, all the chess programs across the world will become outdated. The same thing will happen to the suspicious-email flagging system. Once spammers learn which signals you use to flag them, they will avoid those signals, and the flagging system will become ineffective.

For this reason, a system that can learn becomes important.

-> Return of animation

But before that, let's draw a diagram to represent AI. We will revisit this diagram as we uncover the other concepts.

### 2. Animation

This screen begins where the introduction finished.

Within the first second, the screen rearranges itself. Two smaller cards move to the top, and the other two move to the bottom.

The email card becomes smaller and shifts toward the left.

All these changes happen simultaneously.

Then, the Flagged card is highlighted while the other three cards dim. A copy of the Flagged card is created in exactly the same position. The copy moves into the empty space on the upper-right, while the original card remains dimmed.

Below it, three items are written one by one:

- Unknown sender.
- Urgent wording.
- Suspicious link.

Once the live camera footage ends, the animation returns and the screen zooms out. The duplicated Flagged card moves farther to the right, into the adjacent empty space, and the camera zooms in on it. The card then expands, and **AI** appears near its top edge, just below the border.


## 3. Explain machine learning through the spam score, training, and inference.

Now, back to the learning part. A system that can learn may overcome some of these limitations. Machine learning is one way—in fact, one of the most important ways—to build AI. Machine learning means that a machine learns patterns from examples and data.

In our email example, the system that marked this email as spam learned from a large number of emails that had already been labelled as spam or not spam.

But what does it actually mean to learn from past examples and use that learning? Is it magic? No. It is mathematics.

A simple machine-learning system has two parts. The first part is learning, which we call training.

The second part is using what it has learned, which we call inference.

We used a previously trained model to predict that our email is spam. This is called inference.

Let's say you have a CSV file containing data about plot prices in Muzaffarpur. We can plot those examples on a graph.

Can you guess the price of a 4,000-square-foot plot? Around ₹60 lakh, or ₹6 million, right? You probably predicted it using intuition.

Now, let's see how a machine-learning model can be trained on this data.

Let's begin with a line represented by the equation `y = ax + b`. If we adjust this line to minimise the overall error, we may get an approximate equation that can predict plot prices.

Putting 4,000 into this equation gives us approximately ₹60 lakh. So, we have used machine learning to make a prediction.

The equation `y = ax + b` is our **model**. Adjusting its parameters using real examples is called **training** the machine-learning model. Using the trained model to predict a new value is called **inference**.



Machine learning is a part of AI: it is one way to build systems that learn patterns from examples.



### Machine learning animation

This segment uses three persistent screens:

- **Main email screen:** `x = [-8, 8]`, `y = [-4.5, 4.5]`.
- **AI diagram screen:** `x = [8, 24]`, `y = [-4.5, 4.5]`.
- **Machine Learning explainer screen:** `x = [-8, 8]`, `y = [4.5, 13.5]`.

The segment begins on the main email screen.

#### Move from the spam result to Machine Learning

The **Spam 96%** card becomes bright while the other three result cards remain dimmed. Create a copy of the Spam card in exactly the same position. Once the copy separates, the original Spam card dims again.

The camera zooms out while the copied card moves upward into the Machine Learning explainer screen. These actions happen simultaneously, so the audience can see where the new screen is relative to the email screen.

As the copied card crosses into the upper screen, its text changes from **SPAM 96%** to **MACHINE LEARNING**. The card expands slightly and becomes the title card for the new screen. The camera then zooms in and centres on the upper screen at approximately `[0, 9]`.

On the main screen below:

- The email remains at full opacity.
- All four original result cards remain in place and dimmed.
- All four arrows remain visible and continue tracking the email and their cards every frame.
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

Write **PLOT PRICES IN MUZAFFARPUR** beneath the title. A CSV document appears in the centre with the columns **Plot size (sq ft)** and **Price (₹ lakh)**. Use a small, legible dataset whose trend supports a prediction near ₹60 lakh for 4,000 square feet.

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

**`y = 14x + 4`**

At `x = 4`, this produces `y = 60`. Lock the `a` and `b` chips and stamp **TRAINED** beside the final equation. The dataset and final line should be designed to make this fit visually plausible.

#### Use the trained model for inference

When the narration says, “Putting 4,000 into this equation,” transform **4,000 sq ft** into **`x = 4` thousand sq ft** beside the equation. Then reveal the substitution step by step:

**`y = 14(4) + 4 = 60`**

At the same time, a cyan guide rises from `4,000` on the x-axis until it meets the fixed trained line, then travels left to the y-axis. Resolve the result as **₹60 LAKH**. The trained line and parameter values must remain fixed throughout this inference beat.

#### Turn the graph into a model

When the narration says, “The equation `y = ax + b` is our model,” fade the CSV and graph furniture while keeping the fitted line and equation visible. Compress them into a compact green card labelled:

Place **MODEL** on the first line and `y = ax + b` directly beneath it.

Place the two locked parameter chips, `a = 14` and `b = 4`, inside the card. Beneath it, reveal the two definitions in narration order:

- **TRAINING** — adjusting the parameters using real examples.
- **INFERENCE** — using the trained model to predict a new value.

For Training, briefly replay miniature data dots entering while `a` and `b` adjust. For Inference, lock both parameters and pass **4,000 sq ft** through the model to produce **₹60 lakh**. This is a compact recap, not a second full demonstration.

#### Add Machine Learning to the AI diagram

Clear the recap elements, leaving only the green **MACHINE LEARNING** title card. Zoom out far enough to reveal the upper ML screen, the original email screen below, and the AI diagram screen to the right.

Move the Machine Learning card diagonally into the AI screen at `x = [8, 24]`, `y = [-4.5, 4.5]`. As it enters the AI box, expand it into a smaller green region labelled **MACHINE LEARNING**. Place **Spam 96%** inside the ML region. Keep **Flagged** inside the larger AI region but outside ML.

The spatial relationship must be immediately readable:

- **Flagged** is AI, but it is not Machine Learning.
- **Spam 96%** is Machine Learning, and Machine Learning sits inside AI.

Zoom into the AI diagram and pulse the ML region once as the narration concludes:

**Machine learning is one way to build AI.**

Hold this composition for the transition into the next segment.



## 4. Briefly compare Data Science with machine learning and mention the major ML learning types.

-> Live camera feed

Before we move deeper into Machine Learning, let us briefly compare it with another term we frequently encounter: Data Science.

Machine Learning builds systems that learn patterns from data. In our previous example, the system learned from emails labelled as spam or not spam. It then applied those learned patterns to a new email and predicted its spam score.

Data Science, by contrast, can ask broader questions about the data itself. How many spam emails arrive every day? Where do they come from? Is their number increasing? What other patterns can we discover? Should spam and not spam be the only classifications available in an email inbox? Should we also provide another category for important emails?

To answer such questions, a data scientist may collect data, clean it, analyse it, visualise it, and sometimes build a machine-learning model.

-> Live camera feed ends here; animation starts

So, Data Science and Machine Learning overlap, but they are not the same thing. Data Science can use Machine Learning as one of its tools. At the same time, building useful Machine Learning systems often relies on data science practices—such as collecting, cleaning, exploring, and validating data—to ensure that models learn from reliable data and that their predictions are interpreted meaningfully.

Machine Learning itself can also happen in different ways.

When we train a model using emails that have already been labelled as spam or not spam, that is called **supervised learning**. The model learns from examples for which the correct answer is already known.

If we give the model emails without any labels and ask it to discover groups or patterns on its own, that is called **unsupervised learning**. For example, it might discover groups that appear to correspond to shopping, academic, or personal emails. The model finds the groups; we interpret what those groups mean.

If we have a small number of labelled emails and a much larger number of unlabelled emails, we can use both. This is called **semi-supervised learning**.

When an agent takes actions and learns from rewards or penalties based on the outcomes of those actions, that is called **reinforcement learning**. For example, an email assistant might gradually learn when to flag, prioritise, or archive a message based on feedback it receives over time.

You may also hear about other approaches, such as **self-supervised learning**, especially when people discuss large foundation models. In self-supervised learning, the training signal is created from the unlabelled data itself.

Each of these topics deserves a full playlist of its own. For today, remember that they describe different ways in which a machine-learning system can learn.

Next, let us look at a particularly powerful family of machine-learning models: neural networks and Deep Learning.

### 4. ML vs Data Science Animation

This segment continues from Segment 3's final taxonomy frame.

The persistent screens are now:

- **Main email screen:** `x = [-8, 8]`, `y = [-4.5, 4.5]`.
- **Machine Learning explainer screen:** `x = [-8, 8]`, `y = [4.5, 13.5]`.
- **AI diagram screen:** `x = [8, 24]`, `y = [-4.5, 4.5]`.
- **Data Science and learning-types screen:** `x = [24, 40]`, `y = [-4.5, 4.5]`.

During the live-camera section, hold Segment 3's final taxonomy frame completely still, including the Kavriq logo. When the live-camera section ends, zoom out to reveal the adjacent screen at `x = [24, 40]`, `y = [-4.5, 4.5]`, and move the camera into it.

Begin by writing **MACHINE LEARNING vs DATA SCIENCE** near the top of the screen.

Then draw two solid circles. Label the circle on the left **MACHINE LEARNING** and the circle on the right **DATA SCIENCE**. The circles move toward each other, compress slightly when they meet, and bounce apart. They then move together again and settle with a clearly visible overlapping region.

In the overlap, write **DATA** in bold. Beneath it, reveal the shared practices mentioned in the narration on separate lines:

- **COLLECT**
- **CLEAN**
- **EXPLORE**
- **VALIDATE**

Keep these words within the overlap to communicate that useful work in both fields depends on reliable, well-understood data.

From the Machine Learning side, draw an arrow toward the lower-left and write:

**LEARN PATTERNS FROM DATA → PREDICTIONS**

From the Data Science side, draw an arrow toward the lower-right and write:

**FIND INSIGHTS IN DATA → INFORM DECISIONS**

Keep these two statements aligned along the bottom so the distinction can be understood at a glance.

When the narration moves to the different ways in which Machine Learning can happen, fade the comparison title and the text inside the Data Science circle. Move the Data Science circle slightly to the right and dim it. Expand the Machine Learning circle so it occupies most of the screen.

Inside the expanded Machine Learning circle, write the following terms one at a time on separate lines:

- **SUPERVISED LEARNING**
- **UNSUPERVISED LEARNING**
- **SEMI-SUPERVISED LEARNING**
- **REINFORCEMENT LEARNING**
- **SELF-SUPERVISED LEARNING**

Highlight each term as it is introduced in the narration. Keep previously introduced terms visible but dimmed, so the audience can see that all five are approaches associated with Machine Learning without competing with the current term.


