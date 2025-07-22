<template>
  <div class="min-h-100">
    <SurveyComponent :model="survey" />
  </div>
</template>

<script lang="ts" setup>
import { SurveyComponent } from 'survey-vue3-ui';
import 'survey-core/survey-core.css';
import { Model } from 'survey-core';
import { generateRandomID } from '~/server/utils/stringGenerator';
import { industryDropdownChoices } from '~/models/choices';
import Company from '~/models/Company';
import type { ComparisonExpressionOperator } from 'mongoose';

const surveyModel = {
  pages: [{
    title: 'Company Info',
    elements: [
    {
      name: "companyInfo.name",
      title: "What's the name of your company?",
      type: 'text',
      isRequired: true
    },
    {
      name: "companyInfo.industry",
      title: "What industry is your company in?",
      type: "dropdown",
      choices: industryDropdownChoices,
    },
    {
      name: "companyInfo.size",
      title: "How many people are in your company?",
      type: "number",
      inputType: "number",
      min: 1,
      isRequired: true
    }, 
    {
      name: "website",
      title: "What is your company website?",
      type: "text",
      inputType: "url"
    }
  ]}, {
    title: 'Company Location',
   elements: [
    {
      name: "companyInfo.localization.city",
      title: "Which city is your company based in?",
      type: "text"
    },
    {
      name: "companyInfo.localization.state",
      title: "Which state is your company based in? (optional)",
      type: "text"
    },
    {
      name: "companyInfo.localization.postzip",
      title: "ZIP or postal code?",
      type: "text",
      inputType: "text"
    },
    {
      name: "companyInfo.localization.timezone",
      title: "Your company’s time zone (e.g. EST, PST)?",
      type: "text"
    }
   ]}, {
    title: 'Bob Details',
   elements: [
    {
      name: "bobInfo.specifications.tone",
      title: "Describe BOB's tone",
      type: "text",
      description: "Example: serious, corporate family, parody, etc."
    },
    {
      name: "bobInfo.specifications.description",
      title: "How descriptive should BOB be? (1–10)",
      type: "rating",
      rateMin: 1,
      rateMax: 10,
      minRateDescription: "Very brief",
      maxRateDescription: "Very detailed"
    },
    {
      name: "bobInfo.specifications.avoid",
      title: "What phrases or behaviors should BOB avoid?",
      type: "comment",
      description: "List anything BOB should never say or do (comma or line separated)"
    }
   ]
  }, {
    title: 'Company Roles',
    elements: [
      {
      name: "companyRoles",
      title: "What are the roles in your company? (these will start as your groups!)",
      type: "comment",
      description: "List any role at your company, separate by commas!"
    }
    ]
  }]
}
const survey = new Model(surveyModel)

//NOW WE MOVE THE DATA:
const SURVEY_ID = 1
var results = new Company()

const surveyComplete = async (survey: any) => {
  const companyID = 'COM-' + generateRandomID(9)
  survey.setValue("companyID", companyID);
  results = defineSurveySchema(survey)

  //call api to save company scheme
  const companyReturn = await $fetch('/api/company/createCompany', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(results)
  });
  if(companyReturn){
    console.log("success! Company Added")
    //do stuff when company added, redirect and guide to main user login.
  } else {
    console.error("something went wrong! add failed.")
  }
}

const defineSurveySchema = (survey: any) => {
  const finalCompany = new Company({
    companyID: survey.getQuestionByName("companyID").value,
    companyInfo: {
      name: survey.getQuestionByName("companyInfo.name").value,
      industry: survey.getQuestionByName("companyInfo.industry").value,
      size: survey.getQuestionByName("companyInfo.size").value,
      localization: {
        city: survey.getQuestionByName("companyInfo.localization.city").value,
        state: survey.getQuestionByName("companyInfo.localization.state").value,
        postzip: survey.getQuestionByName("companyInfo.localization.postzip").value,
        timezone: survey.getQuestionByName("companyInfo.localization.timezone").value,
      }
    },
    bobInfo: {
      bobInstanceID: 'BOB-' + generateRandomID(9),
      specifications: {
        tone: survey.getQuestionByName("bobInfo.specifications.tone").value,
        description: survey.getQuestionByName("bobInfo.specifications.description").value,
        avoid: survey.getQuestionByName("bobInfo.specifications.avoid").value.replace('\n', ',').split(',')
      }
    },
    adminAccounts: [],
    website: survey.getQuestionByName("website").value,
    companyRoles: survey.getQuestionByName("companyRoles").value.split(',')
  })
  return finalCompany
}

survey.onComplete.add(surveyComplete)
</script>

<style>

</style>