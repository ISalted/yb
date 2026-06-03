import { createCheckers } from "ts-interface-checker";
import { test, expect } from "../lib/fixtures";
import { PracticeFormData, PRACTICE_FORM, ModalLabel } from "../lib/pages/practice-form.page";
import { Routes } from "../lib/routes";
import postTypes from "../lib/types/post.types-ti";

const { Post } = createCheckers(postTypes);

const validFormData: PracticeFormData = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  gender: "Male",
  mobile: "1234567890",
  address: "123 Main Street, New York",
};

test.describe("Part 2 — Playwright", () => {
  test("Task 4 — should fill text box form and validate submitted values", async ({
    webClient,
  }) => {
    await webClient.goTo(Routes.textBox);

    const formData = {
      fullName: "John Doe",
      email: "john.doe@example.com",
      currentAddress: "123 Main Street, New York",
      permanentAddress: "456 Oak Avenue, Los Angeles",
    };

    await webClient.textBoxPage.fillForm(formData);
    await webClient.textBoxPage.submit();

    await expect(webClient.textBoxPage.outputName()).toContainText(formData.fullName);
    await expect(webClient.textBoxPage.outputEmail()).toContainText(formData.email);
    await expect(webClient.textBoxPage.outputCurrentAddress()).toContainText(formData.currentAddress);
    await expect(webClient.textBoxPage.outputPermanentAddress()).toContainText(formData.permanentAddress);
  });

  test.describe("Task 5 — Practice Form", () => {
    test.beforeEach(async ({ webClient }) => {
      await webClient.goTo(Routes.practiceForm);
    });

    // ---------- Positive ----------

    test("5.1 positive — should show confirmation modal after valid submission", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm(validFormData);
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalTitle()).toBeVisible();
      await expect(webClient.practiceFormPage.modalTitle()).toHaveText(PRACTICE_FORM.modalTitle);
    });

    test("5.2 positive — should display correct student name in modal", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm(validFormData);
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalValue(ModalLabel.studentName)).toHaveText(
        `${validFormData.firstName} ${validFormData.lastName}`,
      );
    });

    test("5.3 positive — should display correct email, gender and mobile in modal", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm(validFormData);
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalValue(ModalLabel.studentEmail)).toHaveText(validFormData.email!);
      await expect(webClient.practiceFormPage.modalValue(ModalLabel.gender)).toHaveText(validFormData.gender!);
      await expect(webClient.practiceFormPage.modalValue(ModalLabel.mobile)).toHaveText(validFormData.mobile!);
    });

    test("5.4 positive — should submit successfully with gender Female", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        ...validFormData,
        gender: "Female",
      });
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalValue(ModalLabel.gender)).toHaveText("Female");
    });

    test("5.5 positive — should submit successfully with gender Other", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        ...validFormData,
        gender: "Other",
      });
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalValue(ModalLabel.gender)).toHaveText("Other");
    });

    test("5.6 positive — should submit with only required fields (no optional email/address)", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        firstName: "John",
        lastName: "Doe",
        gender: "Male",
        mobile: "1234567890",
      });
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalTitle()).toBeVisible();
    });

    // ---------- Negative ----------

    test("5.7 negative — shouldn't submit when all fields are empty", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.submit();

      // No success modal, form still rendered (not a crash), and firstName flagged invalid
      await expect(webClient.practiceFormPage.modalTitle()).toBeHidden();
      await expect(webClient.practiceFormPage.submitButton()).toBeVisible();
      expect(await webClient.practiceFormPage.isFieldValid("firstName")).toBeFalsy();
    });

    test("5.8 negative — shouldn't submit when firstName is missing", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        ...validFormData,
        firstName: undefined,
      });
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalTitle()).toBeHidden();
      expect(await webClient.practiceFormPage.isFieldValid("firstName")).toBeFalsy();
    });

    test("5.9 negative — shouldn't submit when lastName is missing", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        ...validFormData,
        lastName: undefined,
      });
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalTitle()).toBeHidden();
      expect(await webClient.practiceFormPage.isFieldValid("lastName")).toBeFalsy();
    });

    test("5.10 negative — shouldn't submit when gender is missing", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        ...validFormData,
        gender: undefined,
      });
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalTitle()).toBeHidden();
      expect(await webClient.practiceFormPage.isFieldValid("gender")).toBeFalsy();
    });

    test("5.11 negative — shouldn't submit when mobile is missing", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        ...validFormData,
        mobile: undefined,
      });
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalTitle()).toBeHidden();
      expect(await webClient.practiceFormPage.isFieldValid("mobile")).toBeFalsy();
    });

    test("5.12 negative — shouldn't submit when email format is invalid", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        ...validFormData,
        email: "notanemail",
      });
      await webClient.practiceFormPage.submit();

      await expect(webClient.practiceFormPage.modalTitle()).toBeHidden();
      expect(await webClient.practiceFormPage.isFieldValid("email")).toBeFalsy();
    });

    test("5.13 negative — shouldn't submit when mobile has fewer than 10 digits", async ({
      webClient,
    }) => {
      await webClient.practiceFormPage.fillForm({
        ...validFormData,
        mobile: "12345",
      });
      await webClient.practiceFormPage.submit();

      // The 10-digit rule is enforced by the app (React), not HTML5 constraint validation,
      // so we assert the functional outcome (no modal) guarded by the form still being present.
      await expect(webClient.practiceFormPage.modalTitle()).toBeHidden();
      await expect(webClient.practiceFormPage.submitButton()).toBeVisible();
    });
  });

  test('Task 6 — should GET /posts and validate it is an array with id in first item', async ({ apiClient }) => {
    const response = await apiClient.posts.getPosts();
    const body = await response.json();

    expect(response.status()).toBe(200);
    expect(Array.isArray(body)).toBeTruthy();
    expect(body.length).toBeGreaterThan(0);
    Post.strictCheck(body[0]);
  });
});
