class StackRedployGitFormController {
  /* @ngInject */
  constructor($async, StackService, ModalService, Notifications) {
    this.$async = $async;
    this.StackService = StackService;
    this.ModalService = ModalService;
    this.Notifications = Notifications;

    this.state = {
      inProgress: false,
    };

    this.formValues = {
      RefName: '',
      RepositoryAuthentication: false,
      RepositoryUsername: '',
      RepositoryPassword: '',
    };

    this.onChange = this.onChange.bind(this);
    this.onChangeRef = this.onChangeRef.bind(this);
  }

  onChangeRef(value) {
    this.onChange({ RefName: value });
  }

  onChange(values) {
    this.formValues = {
      ...this.formValues,
      ...values,
    };
  }

  async submit() {
    return this.$async(async () => {
      try {
        this.state.inProgress = true;

        const confirmed = await this.ModalService.confirmAsync({
          title: 'Are you sure?',
          message: 'Any changes to this stack made locally in Portainer will be overridden by the definition in git and may cause a service interruption. Do you wish to continue',
          buttons: {
            confirm: {
              label: 'Update',
              className: 'btn-warning',
            },
          },
        });
        if (!confirmed) {
          return;
        }

        await this.StackService.updateGit(this.stack.Id, this.stack.EndpointId, [], false, this.formValues);
      } catch (err) {
        this.Notifications.error('Failure', err, 'Failed redeploying stack');
      } finally {
        this.state.inProgress = false;
      }
    });
  }

  isSubmitButtonDisabled() {
    return this.state.inProgress;
  }

  $onInit() {
    this.formValues.RefName = this.model.ReferenceName;
  }
}

export default StackRedployGitFormController;
