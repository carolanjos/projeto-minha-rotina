<template>
  <div class="register">
    <v-card class="register__card" flat>
      <v-card-text>
        <h1 class="register__title">Minha Rotina</h1>
        <p class="register__subtitle">Criar uma conta</p>

        <v-form @submit.prevent="submit">
          <v-text-field v-model="name" label="Nome" dense class="register__field" />
          <v-text-field
            v-model="email"
            label="E-mail"
            type="email"
            dense
            class="register__field"
          />
          <v-text-field
            v-model="password"
            label="Senha"
            type="password"
            dense
            class="register__field"
          />
          <v-text-field
            v-model="passwordConfirmation"
            label="Confirmar senha"
            type="password"
            dense
            class="register__field"
          />

          <p v-if="errorMessage" class="register__error">{{ errorMessage }}</p>

          <v-btn
            color="primary"
            block
            :loading="loading"
            type="submit"
            class="register__submit-btn"
          >
            Cadastrar
          </v-btn>
        </v-form>

        <p class="register__footer">
          Já tem conta?
          <router-link to="/login">Entrar</router-link>
        </p>
      </v-card-text>
    </v-card>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import extractErrorMessage from '@/shared/http/extract-error-message';

@Component
export default class Register extends Vue {
  private name = '';

  private email = '';

  private password = '';

  private passwordConfirmation = '';

  private loading = false;

  private errorMessage = '';

  private async submit(): Promise<void> {
    this.errorMessage = '';
    this.loading = true;

    try {
      await this.$store.dispatch('auth/register', {
        name: this.name,
        email: this.email,
        password: this.password,
        passwordConfirmation: this.passwordConfirmation,
      });
      this.$router.push('/dashboard');
    } catch (error) {
      this.errorMessage = extractErrorMessage(error, 'Não foi possível criar a conta.');
    } finally {
      this.loading = false;
    }
  }
}
</script>

<style lang="sass" scoped>
.register
  display: flex
  justify-content: center
  align-items: center
  min-height: 80vh

  &__card
    width: 100%
    max-width: 360px

  &__title
    font-size: 24px
    font-weight: 800
    margin-bottom: 4px

  &__subtitle
    opacity: 0.6
    margin-bottom: 20px

  &__field
    margin-bottom: 8px

  &__error
    color: var(--v-error-base)
    font-size: 13px

  &__submit-btn
    margin-top: 8px

  &__footer
    margin-top: 20px
    font-size: 14px
    text-align: center
</style>
